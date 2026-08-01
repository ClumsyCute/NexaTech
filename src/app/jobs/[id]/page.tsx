import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface JobDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const { id } = await params;

  // Fetch job details
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }

  // Check user authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  // Check if candidate already applied for this job to show "Applied" status
  let alreadyApplied = false;
  if (session && session.role === 'CANDIDATE') {
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: id,
        candidateId: session.id,
      },
    });
    if (existingApplication) {
      alreadyApplied = true;
    }
  }

  const applyUrl = session
    ? `/jobs/${id}/apply`
    : `/login?redirect=/jobs/${id}/apply`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-[90vh]">
      {/* Back to jobs link */}
      <div className="mb-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all openings
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              {job.employmentType}
            </span>
            <span className="inline-flex items-center rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 border border-white/10">
              {job.experience}
            </span>
            {job.status === 'CLOSED' && (
              <span className="inline-flex items-center rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-500/20">
                Closed
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight mb-8">
            {job.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 mt-8 pt-8 text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Location</p>
                <p className="text-sm font-semibold text-white">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Salary Range</p>
                <p className="text-sm font-semibold text-white">{job.salary || 'Competitive'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Apply Before</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">Required Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(',').map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md bg-black/20 px-3 py-1 text-xs font-medium text-zinc-300 border border-white/10"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {job.status === 'OPEN' ? (
              alreadyApplied ? (
                <button
                  disabled
                  className="rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-4 text-sm font-bold flex items-center gap-2 cursor-not-allowed"
                >
                  <CheckCircle2 className="h-5 w-5" /> Applied
                </button>
              ) : (
                <Link
                  href={applyUrl}
                  className="rounded-xl bg-emerald-500 px-8 py-4 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Apply for this role
                </Link>
              )
            ) : (
              <button
                disabled
                className="rounded-xl bg-white/5 text-zinc-500 border border-white/10 px-8 py-4 text-sm font-bold cursor-not-allowed"
              >
                Applications Closed
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description Content */}
      <div className="rounded-2xl glass-card p-8 md:p-10 mb-12">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-5 mb-8 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-emerald-400" />
          Role Description
        </h2>

        {/* Clean render using whitespace spacing */}
        <div className="prose prose-invert max-w-none text-zinc-300 text-sm md:text-base leading-loose whitespace-pre-wrap">
          {job.description}
        </div>

        {job.status === 'OPEN' && !alreadyApplied && (
          <div className="border-t border-white/10 mt-12 pt-10 text-center relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">
              Interested in shaping NexaTech?
            </h3>
            <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto relative z-10">
              Our application takes less than 5 minutes. Submit your profile and we will get back to you shortly.
            </p>
            <Link
              href={applyUrl}
              className="inline-block rounded-xl bg-white px-8 py-4 text-sm font-bold text-zinc-950 shadow-xl hover:bg-zinc-200 hover:scale-105 transition-all duration-300 relative z-10"
            >
              Start Application
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
