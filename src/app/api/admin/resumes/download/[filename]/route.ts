import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse } from '@/lib/api-utils';

export const GET = wrapRouteHandler(async (
  req: Request,
  props: { params: Promise<{ filename: string }> }
) => {
  const { filename } = await props.params;

  // 1. Authenticate user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return errorResponse('Unauthorized. Login required.', 401);
  }

  // 2. Authorization check: Admins can download any resume. Candidates can only download their own.
  const isCandidate = session.role === 'CANDIDATE';
  if (isCandidate) {
    const isOwner = filename.startsWith(`${session.id}-`);
    if (!isOwner) {
      return errorResponse('Unauthorized. You cannot view this resume.', 403);
    }
  }

  // 3. Read file from secure uploads folder
  const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);

  try {
    const fileBuffer = await readFile(filePath);
    
    // Return file with PDF content-type headers
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename.split('-').slice(2).join('-')}"`,
      },
    });
  } catch (err) {
    return errorResponse('Resume file not found.', 404);
  }
});
