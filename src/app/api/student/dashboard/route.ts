import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['student']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const studentId = auth.user!.id;

    // 1. Fetch student details
    const studentRows = await query<any[]>(
      `SELECT s.*, b.batch_name, b.start_date as batch_start, b.end_date as batch_end,
              st.name as mentor_name, st.email as mentor_email
       FROM altruisty_lms_students s
       LEFT JOIN altruisty_lms_batches b ON s.batch_id = b.id
       LEFT JOIN altruisty_lms_staff st ON b.staff_id = st.id
       WHERE s.id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const student = studentRows[0];

    // 2. Count successful referrals (friends who completed initial half payment)
    const referralRows = await query<any[]>(
      `SELECT r.*, s.name as referee_name, s.created_at as joined_date 
       FROM altruisty_lms_referrals r
       JOIN altruisty_lms_students s ON r.referee_student_id = s.id
       WHERE r.referrer_student_id = ? AND r.is_paid = 1`,
      [studentId]
    );

    const successfulReferralsCount = referralRows.length;
    const referralDiscountEarned = successfulReferralsCount * 25.00;
    const refereeDiscountApplied = Number(student.referee_discount_applied || 0);

    // Calculate balance fee remaining to pay
    const baseBalanceFee = Number(student.balance_fee);
    const totalDeductions = refereeDiscountApplied + referralDiscountEarned;
    const netBalancePayable = Math.max(0, baseBalanceFee - totalDeductions);

    // 3. Fetch Batch Classes / Sessions
    let classes: any[] = [];
    if (student.batch_id) {
      classes = await query<any[]>(
        `SELECT c.*, st.name as staff_name 
         FROM altruisty_lms_classes c
         LEFT JOIN altruisty_lms_staff st ON c.staff_id = st.id
         WHERE c.batch_id = ?
         ORDER BY c.class_date ASC, c.start_time ASC`,
        [student.batch_id]
      );
    }

    // 4. Fetch Certificate if issued
    const certRows = await query<any[]>(
      'SELECT * FROM altruisty_lms_certificates WHERE student_id = ? AND status = "issued"',
      [studentId]
    );
    const certificate = certRows.length > 0 ? certRows[0] : null;

    // 5. Fetch Payment history
    const payments = await query<any[]>(
      'SELECT * FROM altruisty_lms_payments WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        dob: student.dob,
        address: student.address,
        track_name: student.track_name,
        category: student.category,
        mode: student.mode,
        duration: student.duration,
        total_fee: Number(student.total_fee),
        initial_amount_paid: Number(student.initial_amount_paid),
        balance_fee: baseBalanceFee,
        balance_paid: student.balance_paid === 1,
        balance_amount_paid: Number(student.balance_amount_paid),
        referral_code: student.referral_code,
        referred_by_code: student.referred_by_code,
        batch_id: student.batch_id,
        batch_name: student.batch_name || null,
        batch_start: student.batch_start || null,
        batch_end: student.batch_end || null,
        mentor_name: student.mentor_name || 'Assigned upon batch start',
        mentor_email: student.mentor_email || null,
        status: student.status,
      },
      referrals: {
        code: student.referral_code,
        count: successfulReferralsCount,
        refereeDiscountApplied,
        discountEarned: referralDiscountEarned,
        totalDeductions,
        netBalancePayable,
        list: referralRows.map((r) => ({
          id: r.id,
          name: r.referee_name,
          date: r.joined_date,
          discount: 25.0,
        })),
      },
      classes,
      certificate,
      payments,
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch student dashboard' }, { status: 500 });
  }
}
