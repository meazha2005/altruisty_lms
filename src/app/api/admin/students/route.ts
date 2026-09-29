import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const mode = searchParams.get('mode');

    let sql = `
      SELECT s.*, b.batch_name,
             (SELECT COUNT(*) FROM altruisty_lms_referrals r WHERE r.referrer_student_id = s.id AND r.is_paid = 1) as referral_count,
             (SELECT certificate_id FROM altruisty_lms_certificates c WHERE c.student_id = s.id LIMIT 1) as certificate_id
      FROM altruisty_lms_students s
      LEFT JOIN altruisty_lms_batches b ON s.batch_id = b.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search && search.trim()) {
      sql += ' AND (s.name LIKE ? OR s.email LIKE ? OR s.phone LIKE ? OR s.referral_code LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (category) {
      sql += ' AND s.category = ?';
      params.push(category);
    }

    if (mode) {
      sql += ' AND s.mode = ?';
      params.push(mode);
    }

    sql += ' ORDER BY s.id DESC';

    const students = await query<any[]>(sql, params);

    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    console.error('Admin students fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { studentId, status, batch_id } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (batch_id !== undefined) {
      updates.push('batch_id = ?');
      params.push(batch_id || null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    params.push(studentId);
    await query(`UPDATE altruisty_lms_students SET ${updates.join(', ')} WHERE id = ?`, params);

    return NextResponse.json({ success: true, message: 'Student updated successfully.' });
  } catch (error: any) {
    console.error('Admin update student error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update student' }, { status: 500 });
  }
}
