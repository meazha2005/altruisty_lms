import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const staffId = auth.user!.id;

    // 1. Staff info
    const staffRows = await query<any[]>('SELECT id, name, email, phone, specialization FROM altruisty_lms_staff WHERE id = ?', [staffId]);
    if (staffRows.length === 0) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    const staff = staffRows[0];

    // 2. Batches
    const batches = await query<any[]>(
      `SELECT b.*, t.title as track_title, 
              (SELECT COUNT(*) FROM altruisty_lms_students s WHERE s.batch_id = b.id) as student_count
       FROM altruisty_lms_batches b
       LEFT JOIN altruisty_lms_internship_tracks t ON b.track_id = t.id
       WHERE b.staff_id = ? OR b.staff_id IS NULL
       ORDER BY b.start_date DESC`,
      [staffId]
    );

    // 3. Upcoming scheduled classes
    const upcomingClasses = await query<any[]>(
      `SELECT c.*, b.batch_name 
       FROM altruisty_lms_classes c
       JOIN altruisty_lms_batches b ON c.batch_id = b.id
       WHERE c.staff_id = ? AND c.class_date >= CURDATE()
       ORDER BY c.class_date ASC, c.start_time ASC`,
      [staffId]
    );

    // 4. Unassigned students count
    const unassignedRows = await query<any[]>(
      'SELECT COUNT(*) as unassignedCount FROM altruisty_lms_students WHERE batch_id IS NULL AND email_verified = 1'
    );

    return NextResponse.json({
      success: true,
      staff,
      batches,
      upcomingClasses,
      unassignedStudentsCount: unassignedRows[0]?.unassignedCount || 0,
    });
  } catch (error: any) {
    console.error('Staff dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch staff dashboard' }, { status: 500 });
  }
}
