import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

export const GET = wrapRouteHandler(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return errorResponse('Not authenticated', 401);
  }

  const session = await verifyToken(token);
  if (!session) {
    return errorResponse('Invalid session or session expired', 401);
  }

  return successResponse({ user: session });
});
