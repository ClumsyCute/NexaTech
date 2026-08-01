import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'nexatech_super_secret_jwt_key_for_development_purposes_only';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface PasswordResetPayload {
  userId: string;
  email: string;
  purpose: 'PASSWORD_RESET';
}

/**
 * Creates a signed JWT containing user session info.
 * The session will expire in 7 days by default.
 */
export async function createToken(payload: UserSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Creates a signed, short-lived JWT specifically for resetting password (1 hour validity).
 */
export async function createPasswordResetToken(payload: Omit<PasswordResetPayload, 'purpose'>): Promise<string> {
  return await new SignJWT({ ...payload, purpose: 'PASSWORD_RESET' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT and extracts the user session payload.
 * Returns null if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a password reset JWT. Returns the payload if valid and purpose is PASSWORD_RESET.
 */
export async function verifyPasswordResetToken(token: string): Promise<PasswordResetPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    if (payload.purpose !== 'PASSWORD_RESET' || !payload.userId || !payload.email) {
      return null;
    }
    return payload as unknown as PasswordResetPayload;
  } catch (error) {
    return null;
  }
}

