import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';
import { generateOfferLetterPdfBuffer } from '@/lib/pdfGenerator';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['student']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const studentId = auth.user!.id;

    const studentRows = await query<any[]>(
      `SELECT id, name, track_name, duration, created_at FROM altruisty_lms_students WHERE id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    const student = studentRows[0];
    const regDateObj = student.created_at ? new Date(student.created_at) : new Date();
    const dd = String(regDateObj.getDate()).padStart(2, '0');
    const mm = String(regDateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = regDateObj.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    const studentRegId = `125${yyyy}${String(student.id).padStart(4, '0')}`;

    const pdfBuffer = await generateOfferLetterPdfBuffer({
      candidateName: student.name,
      domain: student.track_name,
      startDate: formattedDate,
      duration: student.duration || '30 Days',
      date: formattedDate,
      regId: studentRegId,
    });

    const sanitizedName = student.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Altruisty_Offer_Letter_${sanitizedName}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error serving offer letter PDF:', error);
    return NextResponse.json({ error: 'Failed to generate offer letter PDF' }, { status: 500 });
  }
}
