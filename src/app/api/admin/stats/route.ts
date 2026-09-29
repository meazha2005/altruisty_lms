import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 1. Total students
    const studentStats = await query<any[]>(`
      SELECT 
        COUNT(*) as totalStudents,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verifiedStudents,
        SUM(CASE WHEN balance_paid = 1 THEN 1 ELSE 0 END) as fullyPaidStudents
      FROM altruisty_lms_students
    `);

    // 2. Revenue collected
    const revenueStats = await query<any[]>(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalRevenue,
        COALESCE(SUM(CASE WHEN payment_type = 'initial_half' THEN amount ELSE 0 END), 0) as initialHalfRevenue,
        COALESCE(SUM(CASE WHEN payment_type = 'balance_final' THEN amount ELSE 0 END), 0) as balanceRevenue
      FROM altruisty_lms_payments
      WHERE status = 'success'
    `);

    // 3. Batches count
    const batchStats = await query<any[]>(`
      SELECT 
        COUNT(*) as totalBatches,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeBatches
      FROM altruisty_lms_batches
    `);

    // 4. Staff count
    const staffStats = await query<any[]>(`
      SELECT COUNT(*) as totalStaff FROM altruisty_lms_staff WHERE status = 'active'
    `);

    // 5. Certificates count
    const certStats = await query<any[]>(`
      SELECT COUNT(*) as totalCertificates FROM altruisty_lms_certificates WHERE status = 'issued'
    `);

    // 6. Recent registrations
    const recentStudents = await query<any[]>(`
      SELECT id, name, email, track_name, category, mode, duration, initial_amount_paid, balance_paid, created_at
      FROM altruisty_lms_students
      ORDER BY id DESC LIMIT 5
    `);

    // 7. Recent payments
    const recentPayments = await query<any[]>(`
      SELECT p.*, s.name as student_name, s.email as student_email
      FROM altruisty_lms_payments p
      JOIN altruisty_lms_students s ON p.student_id = s.id
      ORDER BY p.id DESC LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: Number(studentStats[0]?.totalStudents || 0),
        verifiedStudents: Number(studentStats[0]?.verifiedStudents || 0),
        fullyPaidStudents: Number(studentStats[0]?.fullyPaidStudents || 0),
        totalRevenue: Number(revenueStats[0]?.totalRevenue || 0),
        initialHalfRevenue: Number(revenueStats[0]?.initialHalfRevenue || 0),
        balanceRevenue: Number(revenueStats[0]?.balanceRevenue || 0),
        totalBatches: Number(batchStats[0]?.totalBatches || 0),
        activeBatches: Number(batchStats[0]?.activeBatches || 0),
        totalStaff: Number(staffStats[0]?.totalStaff || 0),
        totalCertificates: Number(certStats[0]?.totalCertificates || 0),
      },
      recentStudents,
      recentPayments,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin stats' }, { status: 500 });
  }
}
