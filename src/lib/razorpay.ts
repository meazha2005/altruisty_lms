import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SqTKTI1LnaHwA8';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'Tu6sXYc2kLSGWcwJIzEr2ISi';

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function createRazorpayOrder(amountInRupees: number, receipt: string, notes: Record<string, string> = {}) {
  // Razorpay amounts are in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100);
  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    notes,
  };
  return await razorpay.orders.create(options);
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}
