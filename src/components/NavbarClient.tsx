'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, LogOut, Briefcase, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

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
  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-6xl rounded-2xl glass shadow-lg shadow-black/20"
      >
        <div className="px-4 sm:px-6">
          <div className="flex h-14 justify-between items-center">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:shadow-emerald-500/40 group-hover:scale-105">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Nexa<span className="text-emerald-400">Tech</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:ml-10 sm:flex sm:space-x-1 sm:items-center">
                <Link
                  href="/"
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive('/')
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Home
                  {isActive('/') && (
                    <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full opacity-50" />
                  )}
                </Link>
                <Link
                  href="/jobs"
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive('/jobs')
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Jobs
                  {isActive('/jobs') && (
                    <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full opacity-50" />
                  )}
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
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Notifications Bell */}
                  <Link
                    href="/dashboard/notifications"
                    className="relative rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse">
                      </span>
                    )}
                  </Link>

                  {/* Profile Indicator */}
                  <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-1">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-semibold text-white leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="rounded-full p-1.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                      title="Logout"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden gap-2">
              {user && (
                <Link
                  href="/dashboard/notifications"
                  className="relative rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse">
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-white/5 overflow-hidden bg-zinc-950/50"
            >
              <div className="px-4 py-3 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Jobs
                </Link>

                {user ? (
                  <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <Link
                      href={dashboardLink}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20"
                    >
                      Apply Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

