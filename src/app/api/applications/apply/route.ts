import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse, logger } from '@/lib/api-utils';

export const POST = wrapRouteHandler(async (req: Request) => {
  // 1. Authenticate user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session || session.role !== 'CANDIDATE') {
    return errorResponse('Unauthorized. Candidate access required.', 401);
  }

  // 2. Parse form data
  const formData = await req.formData();
  
  const jobId = formData.get('jobId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string | null;
  const linkedIn = formData.get('linkedIn') as string | null;
  const gitHub = formData.get('gitHub') as string | null;
  const portfolio = formData.get('portfolio') as string | null;
  const yearsOfExperienceStr = formData.get('yearsOfExperience') as string;
  const skills = formData.get('skills') as string;
  const currentCompany = formData.get('currentCompany') as string | null;
  const currentCtc = formData.get('currentCtc') as string | null;
  const expectedCtc = formData.get('expectedCtc') as string | null;
  const noticePeriod = formData.get('noticePeriod') as string | null;
  const coverLetter = formData.get('coverLetter') as string | null;
  const resumeFile = formData.get('resume') as File | null;

  // Basic validation
  if (!jobId || !name || !email || !phone || !yearsOfExperienceStr || !skills || !resumeFile) {
    return errorResponse('Missing required fields', 400);
  }

  const yearsOfExperience = parseFloat(yearsOfExperienceStr);
  if (isNaN(yearsOfExperience)) {
    return errorResponse('Years of experience must be a number', 400);
  }

  // Verify job exists and is open
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status !== 'OPEN') {
    return errorResponse('Job position is closed or does not exist.', 400);
  }

  // Check if candidate already applied for this job
  const existingApplication = await prisma.application.findFirst({
    where: {
      jobId,
      candidateId: session.id,
    },
  });

  if (existingApplication) {
    return errorResponse('You have already applied for this position.', 400);
  }

  // 3. Handle PDF file upload
  if (resumeFile.type !== 'application/pdf') {
    return errorResponse('Resume must be a PDF file.', 400);
  }

  // Limit file size to 10MB
  if (resumeFile.size > 10 * 1024 * 1024) {
    return errorResponse('Resume must be smaller than 10MB.', 400);
  }

  const bytes = await resumeFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define file paths
  const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
  await mkdir(uploadDir, { recursive: true });

  const uniqueFileName = `${session.id}-${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = path.join(uploadDir, uniqueFileName);

  // Write file
  await writeFile(filePath, buffer);
  logger.info(`Resume saved: ${filePath}`);

  // 4. Create application database record
  const application = await prisma.application.create({
    data: {
      candidateId: session.id,
      jobId,
      name,
      email,
      phone,
      address,
      linkedIn,
      gitHub,
      portfolio,
      yearsOfExperience,
      skills,
      currentCompany,
      currentCtc,
      expectedCtc,
      noticePeriod,
      coverLetter,
      resumePath: uniqueFileName, // Save reference filename in database
    },
  });

  // 5. Send automated candidate notification
  await prisma.notification.create({
    data: {
      userId: session.id,
      title: 'Application Received',
      message: `Your application for the "${job.title}" position has been successfully received. We will review your profile shortly.`,
      type: 'STATUS_CHANGE',
    },
  });

  return successResponse({
    applicationId: application.id,
    jobTitle: job.title,
  });
});
