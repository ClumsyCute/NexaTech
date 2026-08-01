import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back to jobs link */}
      <div className="mb-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all openings
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-500/20">
            {job.employmentType}
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {job.experience}
          </span>
          {job.status === 'CLOSED' && (
            <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
              Closed
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {job.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-850 mt-6 pt-6 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600/80" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Location</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-600/80" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Salary Range</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{job.salary || 'Competitive'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600/80" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Apply Before</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Required Core Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.split(',').map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
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
                className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 text-sm font-bold flex items-center gap-1.5 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800"
              >
                <CheckCircle2 className="h-5 w-5" /> Applied
              </button>
            ) : (
              <Link
                href={applyUrl}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-colors dark:hover:bg-indigo-750"
              >
                Apply for this role
              </Link>
            )
          ) : (
            <button
              disabled
              className="rounded-lg bg-slate-100 text-slate-400 px-6 py-3 text-sm font-bold cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            >
              Applications Closed
            </button>
          )}
        </div>
      </div>

      {/* Description Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          Job Description
        </h2>

        {/* Clean render using whitespace spacing */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>

        {job.status === 'OPEN' && !alreadyApplied && (
          <div className="border-t border-slate-100 dark:border-slate-800 mt-10 pt-8 text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Interested in shaping NexaTech?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Our application takes less than 5 minutes. Submit your profile and we will get back to you shortly.
            </p>
            <Link
              href={applyUrl}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all dark:hover:bg-indigo-750"
            >
              Start Application
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
