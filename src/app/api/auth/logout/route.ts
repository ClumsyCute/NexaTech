import { wrapRouteHandler, successResponse } from '@/lib/api-utils';

export const POST = wrapRouteHandler(async () => {
  const response = successResponse({ message: 'Logged out successfully' });

  // Delete the cookie
  response.cookies.delete('token');

  return response;
});
