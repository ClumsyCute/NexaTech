import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { Briefcase, Calendar, FileText, ChevronRight, Inbox, Clock, CheckCircle2 } from 'lucide-react';

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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SHORTLISTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OFFER_RELEASED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ACCEPTED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-emerald-500/20 blur-xl rounded-full opacity-50" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl relative">
            Candidate Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-400 relative">
            Welcome back, <span className="font-semibold text-white">{session.name}</span>. Monitor your job applications here.
          </p>
        </div>
        <Link
          href="/jobs"
          className="rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/10 transition-colors flex items-center gap-2 group"
        >
          <Briefcase className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          Browse Open Jobs
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 relative z-10">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Total Applied</p>
            <p className="text-3xl font-black text-white">{totalApplied}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 relative z-10">
            <Clock className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Active Applications</p>
            <p className="text-3xl font-black text-white">{activeApplications}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 relative z-10">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Offers Received</p>
            <p className="text-3xl font-black text-white">{offersReceived}</p>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="glass-card rounded-3xl overflow-hidden relative z-10">
        <div className="border-b border-white/5 px-8 py-6 bg-white/5">
          <h2 className="text-lg font-bold text-white">Application History</h2>
        </div>

        {applications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-8 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{app.job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                      <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                      {app.job.location} &bull; {app.job.employmentType}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      Applied: {app.createdAt.toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5" title="Submitted PDF file">
                      <FileText className="h-3.5 w-3.5 text-zinc-500" />
                      {app.resumePath.split('-').slice(2).join('-') || 'Resume'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(
                      app.status,
                    )}`}
                  >
                    {getStatusLabel(app.status)}
                  </span>
                  
                  {app.job.status === 'OPEN' && (
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/5 transition-all group-hover:scale-110"
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
          <div className="text-center py-24 px-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Inbox className="h-10 w-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No active applications</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">
              You haven't applied to any job positions yet. Find your next opportunity today.
            </p>
            <div className="mt-8">
              <Link
                href="/jobs"
                className="inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
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
