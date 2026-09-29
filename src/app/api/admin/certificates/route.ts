import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendCertificateEmail } from '@/lib/email';
import { generateCompletionCertificatePdfBuffer } from '@/lib/pdfGenerator';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Issued certificates
    const certificates = await query<any[]>(
      `SELECT c.*, s.name as student_name, s.email as student_email, s.track_name, s.category, s.mode, s.duration
       FROM altruisty_lms_certificates c
       JOIN altruisty_lms_students s ON c.student_id = s.id
       ORDER BY c.id DESC`
    );

    // Eligible students (balance paid, or completed, but not yet issued)
    const eligibleStudents = await query<any[]>(
      `SELECT s.id, s.name, s.email, s.phone, s.track_name, s.category, s.mode, s.duration,
              s.balance_paid, s.total_fee, s.created_at
       FROM altruisty_lms_students s
       LEFT JOIN altruisty_lms_certificates c ON s.id = c.student_id
       WHERE s.balance_paid = 1 AND c.id IS NULL
       ORDER BY s.id DESC`
    );

    return NextResponse.json({
      success: true,
      certificates,
      eligibleStudents,
    });
  } catch (error: any) {
    console.error('Fetch certificates error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { studentId, grade = 'A+' } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    const studentRows = await query<any[]>('SELECT * FROM altruisty_lms_students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    const student = studentRows[0];
    const certId = `ALT-CERT-${new Date().getFullYear()}-${student.id.toString().padStart(4, '0')}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-certificate/${certId}`;

    await query(
      `INSERT INTO altruisty_lms_certificates (
        certificate_id, student_id, issue_date, grade, verification_url, issued_by_admin_id, status
      ) VALUES (?, ?, CURDATE(), ?, ?, ?, 'issued')
      ON DUPLICATE KEY UPDATE 
        grade = VALUES(grade),
        verification_url = VALUES(verification_url),
        status = 'issued'`,
      [certId, student.id, grade, verifyUrl, auth.user!.id]
    );

    // Format dates for the certificate PDF
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const yyyy = now.getFullYear();
    const formattedDate = `${dd}-${mm}-${yy}`;

    const startDateObj = new Date(now);
    startDateObj.setDate(startDateObj.getDate() - 30);
    const s_dd = String(startDateObj.getDate()).padStart(2, '0');
    const s_mm = String(startDateObj.getMonth() + 1).padStart(2, '0');
    const s_yyyy = startDateObj.getFullYear();
    const formattedStartDate = `${s_dd}-${s_mm}-${s_yyyy}`;
    const formattedEndDate = `${dd}-${mm}-${yyyy}`;

    let certPdfBuffer: Buffer | undefined;
    try {
      certPdfBuffer = await generateCompletionCertificatePdfBuffer({
        candidateName: student.name,
        domain: student.track_name,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        duration: student.duration || '30 Days',
        date: formattedDate,
        regno: certId.split('-').pop() || '0001',
        certificateId: certId,
        verificationUrl: verifyUrl,
      });
    } catch (pdfErr) {
      console.error('Failed to generate completion certificate PDF for admin email:', pdfErr);
    }

    // Send email with attached PDF
    await sendCertificateEmail({
      to: student.email,
      studentName: student.name,
      trackName: student.track_name,
      certificateId: certId,
      verificationUrl: verifyUrl,
      pdfBuffer: certPdfBuffer,
    });

    return NextResponse.json({
      success: true,
      message: `Certificate ${certId} issued and notification email sent to ${student.email}.`,
      certificateId: certId,
      verificationUrl: verifyUrl,
    });
  } catch (error: any) {
    console.error('Issue certificate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to issue certificate' }, { status: 500 });
  }
}
