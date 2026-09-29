import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const unassigned = searchParams.get('unassigned') === 'true';
    const batchId = searchParams.get('batch_id');

    let sql = `
      SELECT s.id, s.name, s.email, s.phone, s.category, s.track_name, s.mode, s.duration,
             s.total_fee, s.initial_amount_paid, s.balance_fee, s.balance_paid,
             s.batch_id, b.batch_name, s.status, s.created_at
      FROM altruisty_lms_students s
      LEFT JOIN altruisty_lms_batches b ON s.batch_id = b.id
      WHERE s.email_verified = 1
    `;
    const params: any[] = [];

    if (unassigned) {
      sql += ' AND s.batch_id IS NULL';
    } else if (batchId) {
      sql += ' AND s.batch_id = ?';
      params.push(batchId);
    }

    sql += ' ORDER BY s.id DESC';

    const students = await query<any[]>(sql, params);

    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    console.error('Fetch staff students error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: 500 });
  }
}
