import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const payments = await query<any[]>(
      `SELECT p.*, s.name as student_name, s.email as student_email, s.phone as student_phone,
              s.track_name, s.category, s.mode
       FROM altruisty_lms_payments p
       JOIN altruisty_lms_students s ON p.student_id = s.id
       ORDER BY p.id DESC`
    );

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    console.error('Fetch payments error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 });
  }
}
