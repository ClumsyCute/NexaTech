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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SHORTLISTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OFFER_RELEASED':
      case 'ACCEPTED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-screen">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-emerald-500/20 blur-xl rounded-full opacity-50" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl relative">
            Admin Workspace
          </h1>
          <p className="mt-2 text-sm text-zinc-400 relative">
            Monitor NexaTech recruitment pipelines, job openings, and applicant reviews.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/jobs/new"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Post a Job
          </Link>
          <Link
            href="/admin/applications"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            Review Pipeline
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Active Openings</p>
            <p className="text-3xl font-black text-white">{openJobs}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 relative z-10">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Total Applications</p>
            <p className="text-3xl font-black text-white">{totalApplications}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 relative z-10">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Shortlisted</p>
            <p className="text-3xl font-black text-white">{statusCounts.SHORTLISTED}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 relative z-10">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Offers Accepted</p>
            <p className="text-3xl font-black text-white">{statusCounts.ACCEPTED}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 relative z-10">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        {/* Left Section: Pipeline breakdown and Roles */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pipeline Stage Breakdown */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-4 mb-6">
              Pipeline Stage
            </h2>
            <div className="space-y-5">
              {Object.entries(statusCounts).map(([status, count]) => {
                const percentage = totalApplications > 0 ? (count / totalApplications) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs font-bold mb-2 text-zinc-400">
                      <span>{status.replace(/_/g, ' ')}</span>
                      <span className="text-emerald-400">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Applicants Per Role */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-4 mb-6">
              Applicants Per Role
            </h2>
            {Object.keys(roleBreakdown).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(roleBreakdown).map(([title, count]) => (
                  <div key={title} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium truncate max-w-[200px]" title={title}>
                      {title}
                    </span>
                    <span className="inline-flex h-7 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-medium text-center py-4">No application records found.</p>
            )}
          </div>
        </div>

        {/* Right Section: Recent Applications list */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl overflow-hidden relative z-10 h-full flex flex-col">
            <div className="border-b border-white/5 px-8 py-6 bg-white/5 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Recent Submissions</h2>
              <Link
                href="/admin/applications"
                className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group transition-colors"
              >
                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {recentApplications.length > 0 ? (
              <div className="divide-y divide-white/5 flex-grow">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-8 hover:bg-white/5 transition-colors flex justify-between items-center gap-6 group"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{app.name}</h3>
                      <p className="text-sm text-zinc-400 font-medium mt-1">{app.job.title}</p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-2">
                        Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusBadgeClass(
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
              <div className="text-center py-24 flex-grow flex flex-col justify-center items-center">
                <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-zinc-500" />
                </div>
                <p className="text-zinc-400 font-medium">No applications received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
