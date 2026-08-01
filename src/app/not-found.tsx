import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-6 shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">404 Error</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-6 text-sm leading-7 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Sorry, we couldn't find the page you are looking for. It might have been moved or the URL might be incorrect.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            Go back home
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-semibold text-slate-700 hover:text-indigo-650 dark:text-slate-350 dark:hover:text-indigo-400 transition-colors"
          >
            Browse Job Openings <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
