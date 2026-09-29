import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearSessionCookie(response);
  return response;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    if (session.role === 'admin') {
      const rows = await query<any[]>('SELECT id, name, email, role FROM altruisty_lms_admins WHERE id = ?', [session.id]);
      if (rows.length === 0) return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
      return NextResponse.json({ authenticated: true, user: { ...rows[0], role: 'admin' } });
    }

    if (session.role === 'staff') {
      const rows = await query<any[]>('SELECT id, name, email, phone, specialization, status FROM altruisty_lms_staff WHERE id = ?', [session.id]);
      if (rows.length === 0 || rows[0].status !== 'active') return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
      return NextResponse.json({ authenticated: true, user: { ...rows[0], role: 'staff' } });
    }

    if (session.role === 'student') {
      const rows = await query<any[]>(
        `SELECT id, name, email, phone, dob, address, track_name, category, mode, duration, 
                total_fee, initial_amount_paid, balance_fee, balance_paid, balance_amount_paid,
                referral_code, referred_by_code, referee_discount_applied, email_verified, batch_id, status 
         FROM altruisty_lms_students WHERE id = ?`,
        [session.id]
      );
      if (rows.length === 0) return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
      return NextResponse.json({ authenticated: true, user: { ...rows[0], role: 'student' } });
    }

    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  } catch (error: any) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
