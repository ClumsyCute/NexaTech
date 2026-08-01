import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { wrapRouteHandler, successResponse, errorResponse } from '@/lib/api-utils';

const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  location: z.string().min(2, 'Location is required'),
  experience: z.enum(['Entry Level', 'Mid Level', 'Senior', 'Lead']),
  skills: z.string().min(2, 'Core skills are required (comma-separated)'),
  salary: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  deadline: z.string().transform((val) => new Date(val)),
});

/**
 * GET /api/admin/jobs
 * Lists all jobs for admin view (both open and closed)
 */
export const GET = wrapRouteHandler(async () => {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return successResponse({ jobs });
});

/**
 * POST /api/admin/jobs
 * Creates a new job opening
 */
export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = createJobSchema.parse(body);

  const job = await prisma.job.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      location: parsed.location,
      experience: parsed.experience,
      skills: parsed.skills,
      salary: parsed.salary || null,
      employmentType: parsed.employmentType,
      deadline: parsed.deadline,
      status: 'OPEN',
    },
  });

  return successResponse({ job }, 201);
});
