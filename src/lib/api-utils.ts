import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard colors for terminal output
 */
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

/**
 * Logger for standard server-side output
 */
export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(
      `${COLORS.blue}[INFO]${COLORS.reset} [${new Date().toISOString()}] ${msg}`,
      meta ? JSON.stringify(meta, null, 2) : '',
    );
  },
  success: (msg: string, meta?: any) => {
    console.log(
      `${COLORS.green}[SUCCESS]${COLORS.reset} [${new Date().toISOString()}] ${msg}`,
      meta ? JSON.stringify(meta, null, 2) : '',
    );
  },
  warn: (msg: string, meta?: any) => {
    console.warn(
      `${COLORS.yellow}[WARN]${COLORS.reset} [${new Date().toISOString()}] ${msg}`,
      meta ? JSON.stringify(meta, null, 2) : '',
    );
  },
  error: (msg: string, error?: any) => {
    console.error(
      `${COLORS.red}[ERROR]${COLORS.reset} [${new Date().toISOString()}] ${msg}`,
      error instanceof Error ? error.stack : error || '',
    );
  },
};

/**
 * Standard success response generator for API routes
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

/**
 * Standard error response generator for API routes
 */
export function errorResponse(message: string, status = 500, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors ? { errors } : {}),
    },
    { status },
  );
}

/**
 * Wrapper for API Route Handlers to catch errors globally
 */
export function wrapRouteHandler(
  handler: (req: Request, ...args: any[]) => Promise<Response>,
) {
  return async (req: Request, ...args: any[]) => {
    const url = new URL(req.url);
    const method = req.method;
    logger.info(`Incoming Request: ${method} ${url.pathname}`);

    try {
      const response = await handler(req, ...args);
      logger.success(`Response Sent: ${method} ${url.pathname} - Status: ${response.status}`);
      return response;
    } catch (error: any) {
      logger.error(`Error in route: ${method} ${url.pathname}`, error);

      if (error instanceof ZodError) {
        return errorResponse('Validation failed', 400, error.flatten().fieldErrors);
      }

      // Handle generic errors
      const status = error.status || 500;
      const message = error.message || 'An unexpected error occurred';
      return errorResponse(message, status);
    }
  };
}
