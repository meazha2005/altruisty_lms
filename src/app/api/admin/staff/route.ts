import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const staff = await query<any[]>(
      `SELECT s.id, s.name, s.email, s.phone, s.specialization, s.status, s.created_at,
              (SELECT COUNT(*) FROM altruisty_lms_batches b WHERE b.staff_id = s.id) as batch_count
       FROM altruisty_lms_staff s
       ORDER BY s.id DESC`
    );

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    console.error('Fetch staff error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { name, email, phone, specialization, password } = await req.json();

    if (!name || !email || !phone || !specialization || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing
    const existing = await query<any[]>('SELECT id FROM altruisty_lms_staff WHERE email = ?', [normalizedEmail]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'A staff member with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result: any = await query(
      `INSERT INTO altruisty_lms_staff (name, email, phone, specialization, password_hash, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [name.trim(), normalizedEmail, phone.trim(), specialization.trim(), passwordHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Staff member added successfully',
      staffId: result.insertId,
    });
  } catch (error: any) {
    console.error('Add staff error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add staff' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    await query('UPDATE altruisty_lms_staff SET status = IF(status = "active", "inactive", "active") WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Staff status updated successfully.' });
  } catch (error: any) {
    console.error('Toggle staff error:', error);
    return NextResponse.json({ error: error.message || 'Failed to toggle staff status' }, { status: 500 });
  }
}
