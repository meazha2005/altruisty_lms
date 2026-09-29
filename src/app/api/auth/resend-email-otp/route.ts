import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { currentEmail, newEmail } = await req.json();

    if (!currentEmail) {
      return NextResponse.json({ error: 'Current email is required.' }, { status: 400 });
    }

    const normalizedCurrent = currentEmail.trim().toLowerCase();

    // Check if student exists
    const students = await query<any[]>(
      'SELECT id, name, email, email_verified FROM altruisty_lms_students WHERE email = ?',
      [normalizedCurrent]
    );

    if (students.length === 0) {
      return NextResponse.json({ error: 'Account not found with this email.' }, { status: 404 });
    }

    const student = students[0];

    if (student.email_verified === 1) {
      return NextResponse.json({ message: 'Email is already verified. You can log in.' }, { status: 200 });
    }

    let targetEmail = normalizedCurrent;

    // If student wants to correct their email address
    if (newEmail && newEmail.trim()) {
      const normalizedNew = newEmail.trim().toLowerCase();
      if (normalizedNew !== normalizedCurrent) {
        // Ensure new email is not taken by another student
        const emailCheck = await query<any[]>(
          'SELECT id FROM altruisty_lms_students WHERE email = ? AND id != ?',
          [normalizedNew, student.id]
        );
        if (emailCheck.length > 0) {
          return NextResponse.json({ error: 'This new email address is already in use by another account.' }, { status: 400 });
        }

        // Update student email
        await query('UPDATE altruisty_lms_students SET email = ? WHERE id = ?', [normalizedNew, student.id]);
        targetEmail = normalizedNew;
      }
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await query(
      'UPDATE altruisty_lms_students SET email_otp = ?, otp_expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR) WHERE id = ?',
      [newOtp, student.id]
    );

    // Send email
    await sendVerificationEmail(targetEmail, student.name, newOtp);

    return NextResponse.json({
      success: true,
      updatedEmail: targetEmail,
      message: `A new 6-digit verification code has been sent to ${targetEmail}.`,
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: error.message || 'Failed to resend verification code' }, { status: 500 });
  }
}
