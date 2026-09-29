import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { createRazorpayOrder } from '@/lib/razorpay';
import { sendCertificateEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['student']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const studentId = auth.user!.id;

    // Fetch student
    const studentRows = await query<any[]>(
      'SELECT * FROM altruisty_lms_students WHERE id = ?',
      [studentId]
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    const student = studentRows[0];

    if (student.balance_paid === 1) {
      return NextResponse.json({ error: 'Balance fee has already been paid and settled.' }, { status: 400 });
    }

    // Count referrals
    const referralRows = await query<any[]>(
      'SELECT id FROM altruisty_lms_referrals WHERE referrer_student_id = ? AND is_paid = 1',
      [studentId]
    );

    const referralDiscountEarned = referralRows.length * 25.00;
    const refereeDiscount = Number(student.referee_discount_applied || 0);
    const baseBalanceFee = Number(student.balance_fee);

    const netPayable = Math.max(0, baseBalanceFee - refereeDiscount - referralDiscountEarned);

    // If completely covered by referral discounts (e.g. ₹0 remaining)
    if (netPayable === 0) {
      await query(
        `UPDATE altruisty_lms_students 
         SET balance_paid = 1, balance_amount_paid = 0.00, balance_payment_id = 'REFERRAL_WAIVED'
         WHERE id = ?`,
        [studentId]
      );

      // Auto-issue certificate
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

      sendCertificateEmail({
        to: student.email,
        studentName: student.name,
        trackName: student.track_name,
        certificateId: certId,
        verificationUrl: verifyUrl,
      }).catch(err => console.error('Error sending certificate email:', err));

      return NextResponse.json({
        success: true,
        zeroBalanceSettled: true,
        message: 'Your remaining balance has been completely waived via referral discounts! Your certificate has been issued.',
        certificateId: certId,
      });
    }

    // Create Razorpay Order
    const receipt = `bal_${studentId}_${Date.now().toString().slice(-6)}`;
    const razorpayOrder = await createRazorpayOrder(netPayable, receipt, {
      type: 'balance_payment',
      student_id: studentId.toString(),
      email: student.email,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: netPayable,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Pay balance intent error:', error);
    return NextResponse.json({ error: error.message || 'Failed to prepare balance payment' }, { status: 500 });
  }
}
