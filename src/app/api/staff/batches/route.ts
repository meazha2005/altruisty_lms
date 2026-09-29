import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const batches = await query<any[]>(
      `SELECT b.*, t.title as track_name, st.name as staff_name,
              (SELECT COUNT(*) FROM altruisty_lms_students s WHERE s.batch_id = b.id) as student_count
       FROM altruisty_lms_batches b
       LEFT JOIN altruisty_lms_internship_tracks t ON b.track_id = t.id
       LEFT JOIN altruisty_lms_staff st ON b.staff_id = st.id
       ORDER BY b.id DESC`
    );

    return NextResponse.json({ success: true, batches });
  } catch (error: any) {
    console.error('Fetch batches error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { batch_name, category, track_id, mode, start_date, end_date } = await req.json();

    if (!batch_name || !category || !mode || !start_date || !end_date) {
      return NextResponse.json({ error: 'All batch fields are required.' }, { status: 400 });
    }

    const staffId = auth.user!.role === 'staff' ? auth.user!.id : null;

    const result: any = await query(
      `INSERT INTO altruisty_lms_batches (
        batch_name, category, track_id, mode, staff_id, start_date, end_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'upcoming')`,
      [batch_name.trim(), category, track_id || null, mode, staffId, start_date, end_date]
    );

    return NextResponse.json({
      success: true,
      message: 'Batch created successfully',
      batchId: result.insertId,
    });
  } catch (error: any) {
    console.error('Create batch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create batch' }, { status: 500 });
  }
}
