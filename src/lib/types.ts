export type UserRole = 'admin' | 'staff' | 'student';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin';
}

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive';
}

export interface StudentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  track_id: number | null;
  track_name: string;
  category: 'training' | 'project';
  mode: 'online' | 'offline';
  duration: string;
  total_fee: number;
  coupon_code: string | null;
  coupon_discount: number;
  initial_amount_paid: number;
  initial_payment_id: string | null;
  balance_fee: number;
  balance_paid: number;
  balance_amount_paid: number;
  balance_payment_id: string | null;
  referral_code: string;
  referred_by_code: string | null;
  referee_discount_applied: number;
  email_verified: number;
  batch_id: number | null;
  status: 'active' | 'completed' | 'dropped';
  created_at: string;
}

export interface InternshipTrack {
  id: number;
  slug: string;
  title: string;
  category: 'training' | 'project';
  domain: string;
  description: string;
  highlights: string[];
  is_active: number;
}

export interface PricingPlan {
  id: number;
  category: 'training' | 'project';
  mode: 'online' | 'offline';
  duration: string;
  duration_label: string;
  price: number;
  allows_coupon: number;
  features: string[];
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applicable_category: string;
  min_amount: number;
  max_uses: number;
  used_count: number;
  is_active: number;
  expires_at: string | null;
}

export interface Batch {
  id: number;
  batch_name: string;
  category: 'training' | 'project';
  track_id: number | null;
  track_name?: string;
  mode: 'online' | 'offline';
  staff_id: number | null;
  staff_name?: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  student_count?: number;
  created_at: string;
}

export interface ClassSession {
  id: number;
  batch_id: number;
  batch_name?: string;
  staff_id: number;
  staff_name?: string;
  class_title: string;
  class_date: string;
  start_time: string;
  end_time: string;
  mode: 'online' | 'offline';
  gmeet_link: string | null;
  venue_instructions: string | null;
  mail_sent: number;
  created_at: string;
}

export interface PaymentRecord {
  id: number;
  student_id: number;
  student_name?: string;
  student_email?: string;
  payment_type: 'initial_half' | 'balance_final';
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  status: 'success' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
}

export interface Certificate {
  id: number;
  certificate_id: string;
  student_id: number;
  student_name?: string;
  student_email?: string;
  track_name?: string;
  category?: 'training' | 'project';
  duration?: string;
  issue_date: string;
  grade: string;
  verification_url: string;
  status: 'issued' | 'revoked';
}
