import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendOnlineClassEmail, sendOfflineScheduleEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batch_id');

    let sql = `
      SELECT c.*, b.batch_name, b.mode as batch_mode, st.name as staff_name
      FROM altruisty_lms_classes c
      JOIN altruisty_lms_batches b ON c.batch_id = b.id
      LEFT JOIN altruisty_lms_staff st ON c.staff_id = st.id
    `;
    const params: any[] = [];

    if (batchId) {
      sql += ' WHERE c.batch_id = ?';
      params.push(batchId);
    }

    sql += ' ORDER BY c.class_date DESC, c.start_time DESC';

    const classes = await query<any[]>(sql, params);

    return NextResponse.json({ success: true, classes });
  } catch (error: any) {
    console.error('Fetch classes error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['staff', 'admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const {
      batch_id,
      class_title,
      class_date,
      start_time,
      end_time,
      mode,
      gmeet_link,
      venue_instructions,
    } = body;

    if (!batch_id || !class_title || !class_date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'All schedule details (batch, title, date, start time, end time) are required.' },
        { status: 400 }
      );
    }

    const numericBatchId = parseInt(batch_id, 10);
    if (isNaN(numericBatchId)) {
      return NextResponse.json({ error: 'Invalid batch ID provided.' }, { status: 400 });
    }

    // Verify batch
    const batchRows = await query<any[]>(
      'SELECT id, batch_name, mode, staff_id FROM altruisty_lms_batches WHERE id = ?',
      [numericBatchId]
    );
    if (batchRows.length === 0) {
      return NextResponse.json({ error: 'Target batch was not found.' }, { status: 404 });
    }
    const batch = batchRows[0];

    const sessionMode = mode || batch.mode || 'online';

    if (sessionMode === 'online' && (!gmeet_link || !gmeet_link.trim())) {
      return NextResponse.json(
        { error: 'Google Meet link is required for online sessions.' },
        { status: 400 }
      );
    }

    const staffId = auth.user?.role === 'staff' ? auth.user.id : (batch.staff_id || 1);

    // Insert class
    const insertResult: any = await query(
      `INSERT INTO altruisty_lms_classes (
        batch_id, staff_id, class_title, class_date, start_time, end_time, mode, gmeet_link, venue_instructions, mail_sent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        numericBatchId,
        staffId,
        class_title.trim(),
        class_date,
        start_time,
        end_time,
        sessionMode,
        sessionMode === 'online' ? gmeet_link.trim() : null,
        sessionMode === 'offline' ? (venue_instructions || '').trim() : null,
      ]
    );

    // Fetch batch students to send emails
    const students = await query<any[]>(
      'SELECT id, name, email FROM altruisty_lms_students WHERE batch_id = ? AND email_verified = 1',
      [numericBatchId]
    );

    let emailsSent = 0;

    for (const student of students) {
      try {
        if (sessionMode === 'online') {
          await sendOnlineClassEmail({
            to: student.email,
            studentName: student.name,
            batchName: batch.batch_name,
            classTitle: class_title.trim(),
            date: class_date,
            startTime: start_time,
            endTime: end_time,
            gmeetLink: gmeet_link.trim(),
          });
          emailsSent++;
        } else {
          await sendOfflineScheduleEmail({
            to: student.email,
            studentName: student.name,
            batchName: batch.batch_name,
            classTitle: class_title.trim(),
            date: class_date,
            startTime: start_time,
            endTime: end_time,
            venueInstructions: venue_instructions,
          });
          emailsSent++;
        }
      } catch (mailErr) {
        console.error(`Failed to send email to ${student.email}:`, mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Session "${class_title.trim()}" scheduled successfully! Email notifications sent to ${emailsSent} student(s) in batch ${batch.batch_name}.`,
      classId: insertResult.insertId,
      emailsSent,
    });
  } catch (error: any) {
    console.error('Schedule class error:', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule class' }, { status: 500 });
  }
}
