'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Lock, Key, Loader2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const activeToken = token || tokenFromUrl;
    if (!activeToken.trim()) {
      setError('A valid reset token is required. Please request a new link if needed.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password. The link may have expired.');
      }

      setSuccess(true);
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
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-white mb-2">
            Set New Password
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Choose a strong password to secure your NexaTech candidate account.
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

          {success ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Password Updated!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>

              <Link
                href="/login"
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                Sign in to your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!tokenFromUrl && (
                <div>
                  <label htmlFor="token" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
                    Reset Token
                  </label>
                  <div className="relative group">
                    <input
                      id="token"
                      name="token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 py-3.5 pl-11 pr-4 text-xs font-mono text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                      placeholder="Paste your reset token..."
                    />
                    <Key className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="new-password" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="At least 6 characters"
                  />
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="Repeat new password"
                  />
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
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
                      Updating password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  Return to Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
