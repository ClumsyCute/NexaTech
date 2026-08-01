import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">NexaTech</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Careers</span>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 md:text-left">
            &copy; {new Date().getFullYear()} NexaTech Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Jobs</Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
