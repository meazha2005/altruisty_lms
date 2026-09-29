import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const batchId = parseInt(body.batch_id, 10);

    let studentIdList: number[] = [];
    if (Array.isArray(body.student_ids)) {
      studentIdList = body.student_ids.map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id));
    } else if (body.student_id !== undefined) {
      const parsed = parseInt(body.student_id, 10);
      if (!isNaN(parsed)) studentIdList = [parsed];
    } else if (body.student_ids !== undefined) {
      const parsed = parseInt(body.student_ids, 10);
      if (!isNaN(parsed)) studentIdList = [parsed];
    }

    if (isNaN(batchId) || studentIdList.length === 0) {
      return NextResponse.json(
        { error: 'Please select a valid batch and at least one student.' },
        { status: 400 }
      );
    }

    // Verify batch exists
    const batchRows = await query<any[]>(
      'SELECT id, batch_name FROM altruisty_lms_batches WHERE id = ?',
      [batchId]
    );

    if (batchRows.length === 0) {
      return NextResponse.json({ error: 'Selected batch does not exist.' }, { status: 404 });
    }

    // Update students
    const placeholders = studentIdList.map(() => '?').join(',');
    await query(
      `UPDATE altruisty_lms_students SET batch_id = ? WHERE id IN (${placeholders})`,
      [batchId, ...studentIdList]
    );

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${studentIdList.length} student(s) to ${batchRows[0].batch_name}.`,
    });
  } catch (error: any) {
    console.error('Assign students error:', error);
    return NextResponse.json({ error: error.message || 'Failed to assign students' }, { status: 500 });
  }
}
