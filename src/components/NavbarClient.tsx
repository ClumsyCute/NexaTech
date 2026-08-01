'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, LogOut, Briefcase, LayoutDashboard, User } from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface NavbarClientProps {
  initialUser: UserSession | null;
}

export default function NavbarClient({ initialUser }: NavbarClientProps) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Listen for user changes or refresh user state
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Fetch unread notifications count if logged in
  useEffect(() => {
    if (!user) return;
    
    const fetchNotificationCount = async () => {
      try {
        const res = await fetch('/api/notifications/unread-count');
        const data = await res.json();
        if (data.success) {
          setUnreadNotifications(data.data.count);
        }
      } catch (err) {
        // Quietly fail
      }
    };

    fetchNotificationCount();
    
    // Poll notifications count every 30s in background
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (path: string) => pathname === path;

  // Compute dashboard route based on user role
  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Nexa<span className="text-indigo-600 dark:text-indigo-400">Tech</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 sm:items-center">
              <Link
                href="/"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/jobs"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/jobs')
                    ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
              >
                Jobs
              </Link>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {user ? (
              <>
                {/* Dashboard Shortcut */}
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-slate-500" />
                  <span>Dashboard</span>
                </Link>

                {/* Notifications Bell */}
                <Link
                  href="/dashboard/notifications"
                  className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Profile Indicator */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                      {user.role.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-700 transition-colors"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {user && (
              <Link
                href="/dashboard/notifications"
                className="relative mr-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              isActive('/')
                ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              isActive('/jobs')
                ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
            }`}
          >
            Jobs
          </Link>

          {user ? (
            <div className="border-t border-slate-200 pt-4 mt-4 dark:border-slate-800 space-y-1">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <Link
                href={dashboardLink}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-200 pt-4 mt-4 dark:border-slate-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                Apply Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
