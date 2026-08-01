import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { verifyPasswordResetToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = resetPasswordSchema.parse(body);

  const payload = await verifyPasswordResetToken(parsed.token);
  if (!payload) {
    return errorResponse('Reset token is invalid or has expired. Please request a new link.', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.email !== payload.email) {
    return errorResponse('User account could not be identified.', 404);
  }

  // Hash new password and update
  const hashedPassword = hashPassword(parsed.password);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  // Create an in-app notification for the user
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Security Alert: Password Changed',
      message: 'Your account password was successfully updated. If you did not make this change, please contact security immediately.',
      type: 'CUSTOM',
    },
  });

  console.log(`[AUTH] Password successfully reset for user ${user.email}`);

  return successResponse({
    message: 'Your password has been successfully reset. You can now log in with your new credentials.',
  });
});
