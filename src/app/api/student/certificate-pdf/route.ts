import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { generateCompletionCertificatePdfBuffer } from '@/lib/pdfGenerator';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['student']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const studentId = auth.user!.id;

    // Check certificate and student status
    const certRows = await query<any[]>(
      `SELECT c.*, s.name as student_name, s.track_name, s.duration, s.balance_paid,
              b.start_date as batch_start, b.end_date as batch_end
       FROM altruisty_lms_certificates c
       JOIN altruisty_lms_students s ON c.student_id = s.id
       LEFT JOIN altruisty_lms_batches b ON s.batch_id = b.id
       WHERE c.student_id = ? AND c.status = 'active'`,
      [studentId]
    );

    if (certRows.length === 0) {
      return NextResponse.json({ error: 'Certificate not found or not yet issued.' }, { status: 404 });
    }

    const cert = certRows[0];
    if (!cert.balance_paid) {
      return NextResponse.json({ error: 'Certificate locked pending balance payment.' }, { status: 403 });
    }

    const issueDate = cert.issue_date ? new Date(cert.issue_date) : new Date();
    const dd = String(issueDate.getDate()).padStart(2, '0');
    const mm = String(issueDate.getMonth() + 1).padStart(2, '0');
    const yy = String(issueDate.getFullYear()).slice(-2);
    const formattedDate = `${dd}-${mm}-${yy}`;

    const startDate = cert.batch_start ? new Date(cert.batch_start).toLocaleDateString('en-GB') : formattedDate;
    const endDate = cert.batch_end ? new Date(cert.batch_end).toLocaleDateString('en-GB') : formattedDate;

    const pdfBuffer = await generateCompletionCertificatePdfBuffer({
      candidateName: cert.student_name,
      domain: cert.domain || cert.track_name,
      startDate,
      endDate,
      duration: cert.duration || '30 Days',
      date: formattedDate,
      regno: String(cert.student_id || '').padStart(4, '0'),
      certificateId: cert.certificate_id,
      verificationUrl: cert.verification_url,
    });

    const sanitizedName = cert.student_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Altruisty_Certificate_${sanitizedName}_${cert.certificate_id}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error serving certificate PDF:', error);
    return NextResponse.json({ error: 'Failed to generate certificate PDF' }, { status: 500 });
  }
}
