'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Mail, Loader2, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetData, setResetData] = useState<{ resetUrl: string; email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request password reset.');
      }

      setResetData({
        resetUrl: data.data.resetUrl,
        email: data.data.email,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center items-center gap-3 mb-8 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:scale-110">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            Nexa<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Tech</span>
          </span>
        </Link>
        
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-white mb-2">
            Reset your password
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Enter your candidate account email address and we'll generate a secure reset authorization.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {resetData ? (
            <div className="space-y-6">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Reset Link Ready</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    A secure password reset link has been verified for <strong className="text-emerald-400">{resetData.email}</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                  Instant Simulation Action
                </p>
                <p className="text-xs text-zinc-400">
                  In this live environment, you can directly navigate to the password reset terminal below:
                </p>
              </div>

              <Link
                href={resetData.resetUrl}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                Proceed to Reset Password
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetData(null);
                    setEmail('');
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Send another request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
                  Registered Email address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="candidate@example.com"
                  />
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all hover:scale-[1.02] disabled:hover:scale-100 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating authorization...
                    </>
                  ) : (
                    'Generate Password Reset Link'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
