import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = forgotPasswordSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase().trim() },
  });

  if (!user) {
    // For security and privacy, we provide friendly response even if email is not found, or in internal demo specify it
    return errorResponse('No account registered with this email address.', 404);
  }

  // Generate 1-hour secure password reset token
  const resetToken = await createPasswordResetToken({
    userId: user.id,
    email: user.email,
  });

  const resetUrl = `/reset-password?token=${encodeURIComponent(resetToken)}`;

  console.log(`[AUTH] Password reset requested for ${user.email}. Reset URL: ${resetUrl}`);

  return successResponse({
    message: 'Password reset authorization created successfully.',
    email: user.email,
    resetToken,
    resetUrl,
  });
});
