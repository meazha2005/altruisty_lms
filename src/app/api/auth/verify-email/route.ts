import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanedOtp = otp.toString().trim();

    const students = await query<any[]>(
      `SELECT id, name, email, email_verified, email_otp, otp_expires_at 
       FROM altruisty_lms_students 
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (students.length === 0) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    const student = students[0];

    if (student.email_verified === 1) {
      // Already verified, create session
      const response = NextResponse.json({
        success: true,
        message: 'Email already verified. Logging you in...',
        user: { id: student.id, name: student.name, email: student.email, role: 'student' },
      });
      setSessionCookie(response, {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student',
      });
      return response;
    }

    if (student.email_otp !== cleanedOtp) {
      return NextResponse.json({ error: 'Invalid verification code. Please check your email and try again.' }, { status: 400 });
    }

    // Mark as verified
    await query(
      'UPDATE altruisty_lms_students SET email_verified = 1, email_otp = NULL, otp_expires_at = NULL WHERE id = ?',
      [student.id]
    );

    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully! Welcome to Altruisty Innovation.',
      user: { id: student.id, name: student.name, email: student.email, role: 'student' },
    });

    setSessionCookie(response, {
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
    });

    return response;
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
