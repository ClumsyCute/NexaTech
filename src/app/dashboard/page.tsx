import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { Briefcase, Calendar, FileText, ChevronRight, Inbox, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CandidateDashboardPage() {
  // 1. Authenticate user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect('/login?redirect=/dashboard');
  }

  if (session.role !== 'CANDIDATE') {
    redirect('/admin');
  }

  // 2. Fetch applications
  const applications = await prisma.application.findMany({
    where: { candidateId: session.id },
    include: {
      job: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate statistics
  const totalApplied = applications.length;
  const activeApplications = applications.filter(
    (app) => app.status !== 'REJECTED' && app.status !== 'ACCEPTED',
  ).length;
  const offersReceived = applications.filter(
    (app) => app.status === 'OFFER_RELEASED' || app.status === 'ACCEPTED',
  ).length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'OFFER_RELEASED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Candidate Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-900 dark:text-white">{session.name}</span>. Monitor your job applications here.
          </p>
        </div>
        <Link
          href="/jobs"
          className="rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors"
        >
          Browse Open Jobs
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Applied</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalApplied}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Applications</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeApplications}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Offers Received</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{offersReceived}</p>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Application History</h2>
        </div>

        {applications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{app.job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {app.job.location} &bull; {app.job.employmentType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied: {app.createdAt.toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center gap-1" title="Submitted PDF file">
                      <FileText className="h-4 w-4" />
                      {app.resumePath.split('-').slice(2).join('-') || 'Resume'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusStyle(
                      app.status,
                    )}`}
                  >
                    {getStatusLabel(app.status)}
                  </span>
                  
                  {app.job.status === 'OPEN' && (
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                      title="View Job Details"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <Inbox className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No active applications</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You haven't applied to any job positions yet.
            </p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Browse Career Openings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
