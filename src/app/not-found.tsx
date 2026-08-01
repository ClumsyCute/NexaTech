import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="glass-card p-10 sm:p-12 rounded-3xl max-w-lg w-full text-center relative z-10 border border-white/10 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <Compass className="h-8 w-8 animate-pulse" />
        </div>
        
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 mb-3">
          404 · Page Not Found
        </span>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
          Lost in the Nexus?
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
          The requested coordinate doesn’t exist or has been relocated to another galaxy in our network.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
          <Link
            href="/jobs"
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Explore Openings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
