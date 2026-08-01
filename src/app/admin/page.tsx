import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Authenticate admin
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // 2. Fetch statistics
  const [totalJobs, openJobs, closedJobs, totalApplications, recentApplications, allApplications] =
    await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.job.count({ where: { status: 'CLOSED' } }),
      prisma.application.count(),
      prisma.application.findMany({
        take: 5,
        include: { job: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.findMany({
        include: { job: true },
      }),
    ]);

  // Status breakdown calculations
  const statusCounts = {
    SUBMITTED: 0,
    SHORTLISTED: 0,
    INTERVIEW_SCHEDULED: 0,
    OFFER_RELEASED: 0,
    ACCEPTED: 0,
    REJECTED: 0,
  };

  allApplications.forEach((app) => {
    if (app.status in statusCounts) {
      statusCounts[app.status as keyof typeof statusCounts]++;
    }
  });

  // Calculate applicants per role
  const roleBreakdown: { [title: string]: number } = {};
  allApplications.forEach((app) => {
    roleBreakdown[app.job.title] = (roleBreakdown[app.job.title] || 0) + 1;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';
      case 'OFFER_RELEASED':
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Admin Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor NexaTech recruitment pipelines, job openings, and applicant reviews.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/jobs/new"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4.5 w-4.5" />
            Post a Job
          </Link>
          <Link
            href="/admin/applications"
            className="rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors"
          >
            Review Pipeline
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Openings</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{openJobs}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Applications</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalApplications}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-650 dark:bg-blue-950/20 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Shortlisted</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{statusCounts.SHORTLISTED}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-650 dark:bg-purple-950/20 dark:text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Offers Accepted</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{statusCounts.ACCEPTED}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        {/* Left Section: Pipeline breakdown and Roles */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pipeline Stage Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Pipeline Stage Breakdown
            </h2>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const percentage = totalApplications > 0 ? (count / totalApplications) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-550 dark:text-slate-400">
                      <span>{status.replace(/_/g, ' ')}</span>
                      <span>{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Applicants Per Role */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Applicants Per Role
            </h2>
            {Object.keys(roleBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(roleBreakdown).map(([title, count]) => (
                  <div key={title} className="flex justify-between items-center text-sm">
                    <span className="text-slate-650 dark:text-slate-405 truncate max-w-[200px]" title={title}>
                      {title}
                    </span>
                    <span className="inline-flex h-6 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-850 dark:text-slate-300">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 text-center py-4">No application records found.</p>
            )}
          </div>
        </div>

        {/* Right Section: Recent Applications list */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Submissions</h2>
              <Link
                href="/admin/applications"
                className="text-xs font-semibold text-indigo-650 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentApplications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors flex justify-between items-center gap-4"
                  >
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.name}</h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{app.job.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                          app.status,
                        )}`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">No applications received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
