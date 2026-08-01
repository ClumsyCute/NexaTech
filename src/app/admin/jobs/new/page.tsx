import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import JobFormClient from './JobFormClient';

export const dynamic = 'force-dynamic';

export default async function NewJobPage() {
  // Authenticate admin
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Workspace
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Recruitment pipeline</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Post a New Job Opening</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fill out details to publish this position on the career board.</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-605 dark:bg-indigo-950/30 dark:text-indigo-400">
          <Briefcase className="h-6 w-6" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <JobFormClient />
      </div>
    </div>
  );
}
