import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

/**
 * GET /api/notifications/unread-count
 * Returns the count of unread notifications for the logged in user
 */
export const GET = wrapRouteHandler(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return errorResponse('Unauthorized. Login required.', 401);
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.id,
      isRead: false,
    },
  });

  return successResponse({ count });
});
