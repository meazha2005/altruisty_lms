import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, category, price } = await req.json();

    if (!code || !category || price === undefined) {
      return NextResponse.json({ error: 'Code, category, and price are required.' }, { status: 400 });
    }

    if (category !== 'project') {
      return NextResponse.json({
        valid: false,
        error: 'Discount coupons are not applicable for Training Internships. Only available for Project Internships.',
      });
    }

    const coupons = await query<any[]>(
      `SELECT * FROM altruisty_lms_coupons 
       WHERE code = ? AND is_active = 1 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND used_count < max_uses`,
      [code.trim().toUpperCase()]
    );

    if (coupons.length === 0) {
      return NextResponse.json({ valid: false, error: 'Invalid, expired, or fully redeemed coupon code.' });
    }

    const coupon = coupons[0];
    const numPrice = Number(price);

    if (numPrice < Number(coupon.min_amount)) {
      return NextResponse.json({
        valid: false,
        error: `Minimum price of ₹${coupon.min_amount} is required to apply this coupon.`,
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((numPrice * Number(coupon.discount_value)) / 100);
    } else {
      discount = Math.min(Number(coupon.discount_value), numPrice);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      discountAmount: discount,
      finalPrice: Math.max(0, numPrice - discount),
    });
  } catch (error: any) {
    console.error('Validate coupon error:', error);
    return NextResponse.json({ error: error.message || 'Failed to validate coupon' }, { status: 500 });
  }
}
