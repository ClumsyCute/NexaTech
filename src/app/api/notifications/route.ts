import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

/**
 * GET /api/notifications
 * Lists all notifications for the authenticated user
 */
export const GET = wrapRouteHandler(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return errorResponse('Unauthorized. Login required.', 401);
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse({ notifications });
});

const markReadSchema = z.object({
  id: z.string().optional(), // If omitted, mark all as read
});

/**
 * POST /api/notifications
 * Marks a notification as read (or all if ID is omitted)
 */
export const POST = wrapRouteHandler(async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return errorResponse('Unauthorized. Login required.', 401);
  }

  const body = await req.json().catch(() => ({}));
  const parsed = markReadSchema.parse(body);

  if (parsed.id) {
    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: parsed.id },
    });

    if (!notification || notification.userId !== session.id) {
      return errorResponse('Notification not found or unauthorized.', 404);
    }

    const updated = await prisma.notification.update({
      where: { id: parsed.id },
      data: { isRead: true },
    });

    return successResponse({ notification: updated });
  } else {
    // Mark all as read
    const result = await prisma.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    });

    return successResponse({ count: result.count });
  }
});
