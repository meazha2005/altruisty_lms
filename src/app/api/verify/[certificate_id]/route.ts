import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificate_id: string }> }
) {
  try {
    const { certificate_id } = await params;

    if (!certificate_id) {
      return NextResponse.json({ error: 'Certificate ID is required.' }, { status: 400 });
    }

    const certRows = await query<any[]>(
      `SELECT c.certificate_id, c.issue_date, c.grade, c.status,
              s.name as student_name, s.track_name, s.category, s.mode, s.duration
       FROM altruisty_lms_certificates c
       JOIN altruisty_lms_students s ON c.student_id = s.id
       WHERE c.certificate_id = ?`,
      [certificate_id.trim()]
    );

    if (certRows.length === 0) {
      return NextResponse.json({ valid: false, error: 'Certificate not found. Please verify the ID entered.' }, { status: 404 });
    }

    const cert = certRows[0];

    return NextResponse.json({
      valid: cert.status === 'issued',
      certificate: cert,
    });
  } catch (error: any) {
    console.error('Verify certificate API error:', error);
    return NextResponse.json({ error: error.message || 'Verification service error' }, { status: 500 });
  }
}
