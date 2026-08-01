import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, Briefcase, FileText } from 'lucide-react';
import ApplyFormClient from './ApplyFormClient';

export const dynamic = 'force-dynamic';

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;

  // 1. Fetch job details
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job || job.status !== 'OPEN') {
    notFound();
  }

  // 2. Fetch authenticated candidate details
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect(`/login?redirect=/jobs/${id}/apply`);
  }

  if (session.role !== 'CANDIDATE') {
    redirect('/admin'); // Admin shouldn't apply to jobs
  }

  // Check if already applied
  const existingApplication = await prisma.application.findFirst({
    where: {
      jobId: id,
      candidateId: session.id,
    },
  });

  if (existingApplication) {
    redirect(`/jobs/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job details
        </Link>
      </div>

      {/* Header Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applying for</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{job.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{job.location} &bull; {job.employmentType}</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          <FileText className="h-6 w-6" />
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <ApplyFormClient jobId={job.id} candidateName={session.name} candidateEmail={session.email} />
      </div>
    </div>
  );
}
