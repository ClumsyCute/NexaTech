import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-[90vh]">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to job details
        </Link>
      </div>

      {/* Header Info */}
      <div className="rounded-2xl glass-card p-8 mb-8 flex items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 p-24 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Applying for</span>
          <h1 className="text-2xl font-extrabold text-white mt-2 mb-1">{job.title}</h1>
          <p className="text-sm text-zinc-400 font-medium">{job.location} &bull; {job.employmentType}</p>
        </div>
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 relative z-10">
          <FileText className="h-6 w-6" />
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl glass-card p-8 md:p-10 relative overflow-hidden">
        <ApplyFormClient jobId={job.id} candidateName={session.name} candidateEmail={session.email} />
      </div>
    </div>
  );
}
