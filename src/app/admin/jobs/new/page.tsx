import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { ArrowLeft, Sparkles, PlusCircle } from 'lucide-react';
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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Back button */}
      <div className="mb-6 relative z-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-zinc-500 group-hover:text-emerald-400" />
          Back to Admin Workspace
        </Link>
      </div>

      <div className="glass-card p-8 rounded-3xl mb-8 relative z-10 flex items-center justify-between gap-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3 h-3" />
            Recruitment Pipeline
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Post a New Job Opening</h1>
          <p className="text-sm text-zinc-400 mt-1">Fill out the role specifications and criteria to publish instantly across the portal.</p>
        </div>
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <PlusCircle className="h-7 w-7" />
        </div>
      </div>

      <div className="glass-card p-8 sm:p-10 rounded-3xl relative z-10 border border-white/10">
        <JobFormClient />
      </div>
    </div>
  );
}
