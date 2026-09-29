import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendCertificateEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['student']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const studentId = auth.user!.id;
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing balance payment parameters' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update student balance payment status
    await query(
      `UPDATE altruisty_lms_students 
       SET balance_paid = 1, balance_amount_paid = ?, balance_payment_id = ?
       WHERE id = ?`,
      [Number(amount || 0), razorpay_payment_id, studentId]
    );

    // Record payment
    await query(
      `INSERT INTO altruisty_lms_payments (
        student_id, payment_type, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, status, notes
      ) VALUES (?, 'balance_final', ?, ?, ?, ?, 'success', 'Final balance settlement for certificate')`,
      [studentId, Number(amount || 0), razorpay_order_id, razorpay_payment_id, razorpay_signature]
    );

    // Generate Certificate
    const certId = `ALT-CERT-${new Date().getFullYear()}-${studentId.toString().padStart(4, '0')}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-certificate/${certId}`;

    await query(
      `INSERT INTO altruisty_lms_certificates (
        certificate_id, student_id, issue_date, grade, verification_url, status
      ) VALUES (?, ?, CURDATE(), 'A+', ?, 'issued')
      ON DUPLICATE KEY UPDATE status = 'issued'`,
      [certId, studentId, verifyUrl]
    );

    // Fetch student details for email
    const studentRows = await query<any[]>('SELECT name, email, track_name FROM altruisty_lms_students WHERE id = ?', [studentId]);
    if (studentRows.length > 0) {
      sendCertificateEmail({
        to: studentRows[0].email,
        studentName: studentRows[0].name,
        trackName: studentRows[0].track_name,
        certificateId: certId,
        verificationUrl: verifyUrl,
      }).catch(err => console.error('Error sending certificate email:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Balance payment confirmed and Certificate generated successfully!',
      certificateId: certId,
      verificationUrl: verifyUrl,
    });
  } catch (error: any) {
    console.error('Verify balance payment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify balance payment' }, { status: 500 });
  }
}
