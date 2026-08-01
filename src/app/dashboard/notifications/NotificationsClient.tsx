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
        return <Briefcase className="h-5 w-5 text-indigo-650" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Notifications Center
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep track of application updates, interviews, and career notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <MailOpen className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence initial={false}>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-6 transition-all relative flex gap-4 ${
                    !notif.isRead
                      ? 'bg-indigo-50/20 border-l-4 border-indigo-600 dark:bg-indigo-950/10'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-150/80 dark:bg-slate-800 dark:border-slate-700">
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`text-base font-bold ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(notif.createdAt).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {!notif.isRead && (
                    <div className="flex-shrink-0 self-center">
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
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
          <div className="text-center py-20 px-4">
            <Bell className="mx-auto h-12 w-12 text-slate-400 animate-pulse" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">All caught up!</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You have no notifications in your inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
