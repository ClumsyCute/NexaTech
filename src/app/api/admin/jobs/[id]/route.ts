import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { wrapRouteHandler, successResponse, errorResponse } from '@/lib/api-utils';

const updateJobSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  experience: z.enum(['Entry Level', 'Mid Level', 'Senior', 'Lead']).optional(),
  skills: z.string().min(2).optional(),
  salary: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).optional(),
  deadline: z.string().transform((val) => new Date(val)).optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

/**
 * PUT /api/admin/jobs/[id]
 * Updates an existing job opening
 */
export const PUT = wrapRouteHandler(async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const { id } = await props.params;
  const body = await req.json();
  const parsed = updateJobSchema.parse(body);

  const existingJob = await prisma.job.findUnique({
    where: { id },
  });

  if (!existingJob) {
    return errorResponse('Job position not found', 404);
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      ...parsed,
    },
  });

  return successResponse({ job: updatedJob });
});

/**
 * DELETE /api/admin/jobs/[id]
 * Deletes a job position and cascades deletes applications
 */
export const DELETE = wrapRouteHandler(async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const { id } = await props.params;

  const existingJob = await prisma.job.findUnique({
    where: { id },
  });

  if (!existingJob) {
    return errorResponse('Job position not found', 404);
  }

  await prisma.job.delete({
    where: { id },
  });

  return successResponse({ message: 'Job opening deleted successfully' });
});
