import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { createToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = signupSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (existingUser) {
    return errorResponse('Email already registered', 400);
  }

  // Hash password and create candidate
  const hashedPassword = hashPassword(parsed.password);
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: 'CANDIDATE', // Force signup role to Candidate
    },
  });

  // Automatically seed a welcome notification for new candidate
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Welcome to NexaTech!',
      message: 'Explore our job opportunities, keep your profile updated, and monitor application status right from your candidate dashboard.',
      type: 'CUSTOM',
    },
  });

  // Create session
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  const token = await createToken(sessionUser);

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
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
});
