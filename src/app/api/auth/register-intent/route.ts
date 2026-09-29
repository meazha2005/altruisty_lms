import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      dob,
      address,
      category, // 'training' | 'project'
      mode,     // 'online' | 'offline'
      duration, // '15days' | '1month' | '2month' | '30days'
      password,
      confirmPassword,
      coupon_code,
      referral_code,
    } = body;

    // Validation
    if (!name || !email || !phone || !dob || !address || !category || !mode || !duration || !password) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Phone validation: exactly 10 digits
    const cleanedPhone = phone.toString().replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json({ error: 'Phone number must be exactly 10 digits.' }, { status: 400 });
    }

    // Check if email already registered
    const existing = await query<any[]>('SELECT id, email_verified FROM altruisty_lms_students WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      if (existing[0].email_verified === 0) {
        return NextResponse.json({ 
          error: 'An account with this email exists but is pending email verification. Please verify your email.',
          unverified: true,
          email: email.trim().toLowerCase()
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'This email is already registered. Please login to your dashboard.' }, { status: 400 });
    }

    // Fetch pricing
    const pricingRows = await query<any[]>(
      'SELECT price, allows_coupon FROM altruisty_lms_pricing WHERE category = ? AND mode = ? AND duration = ?',
      [category, mode, duration]
    );

    if (pricingRows.length === 0) {
      return NextResponse.json({ error: 'Selected internship pricing tier not found.' }, { status: 400 });
    }

    const basePrice = Number(pricingRows[0].price);
    const allowsCoupon = pricingRows[0].allows_coupon === 1;

    let discount = 0;
    let validatedCoupon = null;

    // Coupon calculation (Only applicable to Project Internship)
    if (coupon_code && coupon_code.trim()) {
      if (!allowsCoupon) {
        return NextResponse.json({ error: 'Discount coupons are only applicable for Project Internships.' }, { status: 400 });
      }

      const couponRows = await query<any[]>(
        `SELECT * FROM altruisty_lms_coupons 
         WHERE code = ? AND is_active = 1 
         AND (expires_at IS NULL OR expires_at > NOW())
         AND used_count < max_uses`,
        [coupon_code.trim().toUpperCase()]
      );

      if (couponRows.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired coupon code.' }, { status: 400 });
      }

      const coupon = couponRows[0];
      if (basePrice < Number(coupon.min_amount)) {
        return NextResponse.json({ error: `Coupon requires minimum order value of ₹${coupon.min_amount}.` }, { status: 400 });
      }

      if (coupon.discount_type === 'percentage') {
        discount = Math.round((basePrice * Number(coupon.discount_value)) / 100);
      } else {
        discount = Math.min(Number(coupon.discount_value), basePrice);
      }
      validatedCoupon = coupon.code;
    }

    const totalFee = Math.max(0, basePrice - discount);
    // Student pays half (50%) at registration
    const initialAmount = Math.ceil(totalFee / 2);
    const balanceFee = totalFee - initialAmount;

    // Check referral code validity if provided
    let referrerStudent = null;
    if (referral_code && referral_code.trim()) {
      const refRows = await query<any[]>(
        'SELECT id, name FROM altruisty_lms_students WHERE referral_code = ?',
        [referral_code.trim().toUpperCase()]
      );
      if (refRows.length > 0) {
        referrerStudent = refRows[0];
      }
    }

    // Create Razorpay Order
    const receipt = `reg_${Date.now().toString().slice(-8)}`;
    const razorpayOrder = await createRazorpayOrder(initialAmount, receipt, {
      type: 'registration_initial_half',
      email: email.trim().toLowerCase(),
      name: name.trim(),
      category,
      mode,
      duration,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: initialAmount,
      totalFee,
      balanceFee,
      discount,
      couponApplied: validatedCoupon,
      referrerFound: !!referrerStudent,
      referrerName: referrerStudent?.name || null,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Registration intent error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process registration' }, { status: 500 });
  }
}
