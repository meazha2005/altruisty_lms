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

    const students = await query<any[]>(
      `SELECT id, name, email, password_hash, email_verified, status 
       FROM altruisty_lms_students 
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (students.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const student = students[0];

    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (student.email_verified === 0) {
      return NextResponse.json({
        unverified: true,
        email: student.email,
        message: 'Your email address is not yet verified. Please verify your OTP to continue.',
      }, { status: 403 });
    }

    if (student.status === 'dropped') {
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact support.' }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student',
      },
    });

    setSessionCookie(response, {
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
    });

    return response;
  } catch (error: any) {
    console.error('Student login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
