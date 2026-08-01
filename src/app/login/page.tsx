'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // Success! Refresh and redirect
      router.refresh();
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(data.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
      }
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
        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-white mb-2">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-zinc-400">
          Not registered?{' '}
          <Link href="/signup" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            Create a careers profile
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-10 px-6 sm:px-10 rounded-3xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-5 text-sm text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
                Email address
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
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
