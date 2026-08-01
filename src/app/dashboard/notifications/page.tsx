import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  // 1. Authenticate user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect('/login?redirect=/dashboard/notifications');
  }

  // 2. Fetch notifications
  const rawNotifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Date fields
  const notifications = rawNotifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationsClient initialNotifications={notifications} />;
}
