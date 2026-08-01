'use client';

import { useState } from 'react';
import { Bell, Briefcase, Check, Clock, MailOpen, Trash, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
}

export default function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_JOB':
        return <Briefcase className="h-5 w-5 text-emerald-400" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      default:
        return <Bell className="h-5 w-5 text-zinc-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-screen">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-emerald-500/20 blur-xl rounded-full opacity-50" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl relative">
            Notifications Center
          </h1>
          <p className="mt-2 text-sm text-zinc-400 relative">
            Keep track of application updates, interviews, and career notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-[11px] uppercase tracking-wider font-bold text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all group"
          >
            <MailOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="glass-card rounded-3xl overflow-hidden relative z-10">
        {notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-8 transition-colors flex gap-6 group hover:bg-white/5 ${
                    !notif.isRead
                      ? 'bg-emerald-500/5 relative overflow-hidden'
                      : ''
                  }`}
                >
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  )}
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1 relative z-10">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${!notif.isRead ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow space-y-1.5 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`text-base font-bold ${!notif.isRead ? 'text-white' : 'text-zinc-300'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {!notif.isRead && (
                    <div className="flex-shrink-0 self-center relative z-10">
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="flex items-center justify-center h-10 w-10 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-110"
                        title="Mark as read"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 px-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Bell className="h-10 w-10 text-emerald-500/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">
              You have no notifications in your inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
