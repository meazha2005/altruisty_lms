import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const coupons = await query<any[]>('SELECT * FROM altruisty_lms_coupons ORDER BY id DESC');
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    console.error('Fetch coupons error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['admin']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { code, discount_type, discount_value, min_amount, max_uses, expires_at } = await req.json();

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json({ error: 'Code, discount type, and discount value are required.' }, { status: 400 });
    }

    const upperCode = code.trim().toUpperCase();

    await query(
      `INSERT INTO altruisty_lms_coupons (
        code, discount_type, discount_value, applicable_category, min_amount, max_uses, expires_at, is_active
      ) VALUES (?, ?, ?, 'project', ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE 
        discount_type = VALUES(discount_type),
        discount_value = VALUES(discount_value),
        min_amount = VALUES(min_amount),
        max_uses = VALUES(max_uses),
        expires_at = VALUES(expires_at),
        is_active = 1`,
      [upperCode, discount_type, discount_value, min_amount || 0, max_uses || 100, expires_at || null]
    );

    return NextResponse.json({ success: true, message: `Coupon ${upperCode} saved successfully.` });
  } catch (error: any) {
    console.error('Save coupon error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save coupon' }, { status: 500 });
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
      return NextResponse.json({ error: 'Coupon ID is required.' }, { status: 400 });
    }

    await query('UPDATE altruisty_lms_coupons SET is_active = IF(is_active = 1, 0, 1) WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Coupon status toggled successfully.' });
  } catch (error: any) {
    console.error('Delete coupon error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update coupon status' }, { status: 500 });
  }
}
