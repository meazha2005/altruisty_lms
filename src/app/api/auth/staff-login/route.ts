import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const staffMembers = await query<any[]>(
      'SELECT id, name, email, password_hash, specialization, status FROM altruisty_lms_staff WHERE email = ?',
      [normalizedEmail]
    );

    if (staffMembers.length === 0) {
      return NextResponse.json({ error: 'Invalid staff credentials.' }, { status: 401 });
    }

    const staff = staffMembers[0];

    if (staff.status !== 'active') {
      return NextResponse.json({ error: 'Your staff account is currently inactive. Please contact an admin.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, staff.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid staff credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        specialization: staff.specialization,
        role: 'staff',
      },
    });

    setSessionCookie(response, {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: 'staff',
    });

    return response;
  } catch (error: any) {
    console.error('Staff login error:', error);
    return NextResponse.json({ error: error.message || 'Staff authentication failed' }, { status: 500 });
  }
}
