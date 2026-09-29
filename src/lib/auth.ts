import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'altruisty_innovation_lms_super_secret_jwt_key_2026_secure!';
const COOKIE_NAME = 'altruisty_session';

export interface SessionPayload {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'student';
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(response: NextResponse, payload: SessionPayload): void {
  const token = signToken(payload);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function requireAuth(req: NextRequest, allowedRoles?: ('admin' | 'staff' | 'student')[]) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return { user: null, error: 'Unauthorized: No token provided', status: 401 };
  }
  const user = verifyToken(token);
  if (!user) {
    return { user: null, error: 'Unauthorized: Invalid token', status: 401 };
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return { user: null, error: 'Forbidden: Insufficient privileges', status: 403 };
  }
  return { user, error: null, status: 200 };
}
