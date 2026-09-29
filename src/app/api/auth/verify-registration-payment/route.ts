import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendVerificationEmail, sendReferralBonusEmail } from '@/lib/email';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'ALT';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !formData) {
      return NextResponse.json({ error: 'Missing payment or registration verification parameters.' }, { status: 400 });
    }

    // 1. Verify Razorpay Signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Payment signature verification failed. Untrusted payment.' }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      dob,
      address,
      category,
      mode,
      duration,
      track_id,
      track_name,
      password,
      coupon_code,
      referral_code,
    } = formData;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already registered (prevent duplicate submission)
    const existing = await query<any[]>('SELECT id FROM altruisty_lms_students WHERE email = ?', [normalizedEmail]);
    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Account already created. Please verify your email.',
        email: normalizedEmail,
        studentId: existing[0].id,
      });
    }

    // 2. Fetch Pricing
    const pricingRows = await query<any[]>(
      'SELECT price, allows_coupon FROM altruisty_lms_pricing WHERE category = ? AND mode = ? AND duration = ?',
      [category, mode, duration]
    );

    if (pricingRows.length === 0) {
      return NextResponse.json({ error: 'Internship pricing not found' }, { status: 400 });
    }

    const basePrice = Number(pricingRows[0].price);
    let discount = 0;
    let validCouponCode: string | null = null;

    if (coupon_code && pricingRows[0].allows_coupon === 1) {
      const couponRows = await query<any[]>(
        `SELECT * FROM altruisty_lms_coupons 
         WHERE code = ? AND is_active = 1 
         AND (expires_at IS NULL OR expires_at > NOW())
         AND used_count < max_uses`,
        [coupon_code.trim().toUpperCase()]
      );

      if (couponRows.length > 0) {
        const coupon = couponRows[0];
        validCouponCode = coupon.code;
        if (coupon.discount_type === 'percentage') {
          discount = Math.round((basePrice * Number(coupon.discount_value)) / 100);
        } else {
          discount = Math.min(Number(coupon.discount_value), basePrice);
        }
        // Increment coupon use
        await query('UPDATE altruisty_lms_coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
      }
    }

    const totalFee = Math.max(0, basePrice - discount);
    const initialAmount = Math.ceil(totalFee / 2);
    const balanceFee = totalFee - initialAmount;

    // 3. Password Hashing
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Unique Referral Code
    let uniqueReferralCode = generateReferralCode();
    let collisionCheck = await query<any[]>('SELECT id FROM altruisty_lms_students WHERE referral_code = ?', [uniqueReferralCode]);
    while (collisionCheck.length > 0) {
      uniqueReferralCode = generateReferralCode();
      collisionCheck = await query<any[]>('SELECT id FROM altruisty_lms_students WHERE referral_code = ?', [uniqueReferralCode]);
    }

    // 5. Check if referee discount applies
    let referrerStudent: any = null;
    let refereeDiscountApplied = 0.00;
    let validReferredByCode: string | null = null;

    if (referral_code && referral_code.trim()) {
      const refRows = await query<any[]>(
        'SELECT id, name, email FROM altruisty_lms_students WHERE referral_code = ?',
        [referral_code.trim().toUpperCase()]
      );
      if (refRows.length > 0) {
        referrerStudent = refRows[0];
        refereeDiscountApplied = 25.00;
        validReferredByCode = referral_code.trim().toUpperCase();
      }
    }

    // 6. Generate 6-digit Email Verification OTP
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 7. Insert Student Record
    const insertResult: any = await query(
      `INSERT INTO altruisty_lms_students (
        name, email, phone, dob, address, password_hash,
        track_id, track_name, category, mode, duration,
        total_fee, coupon_code, coupon_discount,
        initial_amount_paid, initial_payment_id,
        balance_fee, balance_paid, balance_amount_paid,
        referral_code, referred_by_code, referee_discount_applied,
        email_verified, email_otp, otp_expires_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, 0, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), 'active')`,
      [
        name.trim(),
        normalizedEmail,
        phone.toString().trim(),
        dob,
        address.trim(),
        passwordHash,
        track_id || null,
        track_name || 'Standard Internship Track',
        category,
        mode,
        duration,
        totalFee,
        validCouponCode,
        discount,
        initialAmount,
        razorpay_payment_id,
        balanceFee,
        uniqueReferralCode,
        validReferredByCode,
        refereeDiscountApplied,
        emailOtp,
      ]
    );

    const studentId = insertResult.insertId;

    // 8. Insert Payment Record
    await query(
      `INSERT INTO altruisty_lms_payments (
        student_id, payment_type, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, status, notes
      ) VALUES (?, 'initial_half', ?, ?, ?, ?, 'success', ?)`,
      [
        studentId,
        initialAmount,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        `Initial 50% registration payment for ${category} (${mode}, ${duration})`,
      ]
    );

    // 9. If referred by a friend, record referral and notify referrer!
    if (referrerStudent) {
      await query(
        `INSERT INTO altruisty_lms_referrals (
          referrer_student_id, referee_student_id, referrer_discount, referee_discount, is_paid
        ) VALUES (?, ?, 25.00, 25.00, 1)`,
        [referrerStudent.id, studentId]
      );

      // Send referral reward email to referrer
      sendReferralBonusEmail({
        to: referrerStudent.email,
        studentName: referrerStudent.name,
        refereeName: name.trim(),
        discountAmount: 25,
      }).catch(err => console.error('Error sending referral email:', err));
    }

    // 10. Send Verification Email with OTP
    await sendVerificationEmail(normalizedEmail, name.trim(), emailOtp);

    return NextResponse.json({
      success: true,
      studentId,
      email: normalizedEmail,
      message: 'Payment verified successfully! A 6-digit verification code has been sent to your email.',
    });
  } catch (error: any) {
    console.error('Verify registration payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
