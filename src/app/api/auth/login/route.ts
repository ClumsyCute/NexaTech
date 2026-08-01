import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth-utils';
import { createToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user || !verifyPassword(parsed.password, user.password)) {
    return errorResponse('Invalid email or password', 401);
  }

  // Create JWT token
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  const token = await createToken(sessionUser);

  // Set HTTP-only cookie
  const response = successResponse({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  return response;
});
