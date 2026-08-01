'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error('Unhandled UI exception:', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-650 dark:bg-rose-950/40 dark:text-rose-400 mb-6 shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="text-base font-extrabold text-rose-600 dark:text-rose-400">Server Error</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-6 text-sm leading-7 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          An unexpected error occurred in our system. We have logged the details and are working to resolve the issue.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
