import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admins = await query<any[]>(
      'SELECT id, name, email, password_hash, role FROM altruisty_lms_admins WHERE email = ?',
      [normalizedEmail]
    );

    if (admins.length === 0) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    });

    setSessionCookie(response, {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message || 'Admin authentication failed' }, { status: 500 });
  }
}
