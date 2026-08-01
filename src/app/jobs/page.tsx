import { prisma } from '@/lib/prisma';
import JobsListClient from '@/components/JobsListClient';

// Next.js App Router Page configurations
export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  // Fetch only OPEN jobs
  const rawJobs = await prisma.job.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Date objects to string for client-side serialization safely
  const jobs = rawJobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    deadline: job.deadline.toISOString(),
  }));

  return <JobsListClient initialJobs={jobs} />;
}
