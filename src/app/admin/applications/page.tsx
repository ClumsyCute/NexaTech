import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import ApplicationsPanelClient from './ApplicationsPanelClient';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  // 1. Authenticate admin
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // 2. Fetch all applications
  const rawApplications = await prisma.application.findMany({
    include: {
      job: true,
      candidate: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Date fields safely
  const applications = rawApplications.map((app) => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    job: {
      ...app.job,
      createdAt: app.job.createdAt.toISOString(),
      deadline: app.job.deadline.toISOString(),
    },
    candidate: {
      id: app.candidate.id,
      name: app.candidate.name,
      email: app.candidate.email,
      role: app.candidate.role,
    },
  }));

  return <ApplicationsPanelClient initialApplications={applications} />;
}
