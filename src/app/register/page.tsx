'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Gift,
  Tag,
  Lock,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    category: (searchParams.get('cat') as 'training' | 'project') || '',
    track_name: searchParams.get('track') || '',
    mode: (searchParams.get('mode') as 'online' | 'offline') || '',
    duration: searchParams.get('dur') || '',
    password: '',
    confirmPassword: '',
    coupon_code: '',
    referral_code: searchParams.get('ref') || '',
  });

  const [tracks, setTracks] = useState<any[]>([]);
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [couponValidation, setCouponValidation] = useState<{
    valid: boolean;
    discountAmount: number;
    error?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Tracks and Pricing
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/internships');
        const data = await res.json();
        if (data.success) {
          setTracks(data.tracks);
          setPricingList(data.pricing);
        }
      } catch (err) {
        console.error('Failed to load internships:', err);
      }
    }
    loadData();
  }, []);

  // Invalidate incompatible duration when category changes
  useEffect(() => {
    if (!formData.category) return;
    if (formData.category === 'project') {
      if (formData.duration && formData.duration !== '30days' && formData.duration !== '2month') {
        setFormData((prev) => ({ ...prev, duration: '' }));
      }
    } else if (formData.category === 'training') {
      if (formData.duration && formData.duration !== '15days' && formData.duration !== '1month' && formData.duration !== '2month') {
        setFormData((prev) => ({ ...prev, duration: '' }));
      }
    }
  }, [formData.category]);

  // Calculate current pricing
  const currentPricing = pricingList.find(
    (p) => p.category === formData.category && p.mode === formData.mode && p.duration === formData.duration
  );

  const basePrice = currentPricing ? Number(currentPricing.price) : 0;
  const couponDiscount = couponValidation?.valid ? couponValidation.discountAmount : 0;
  const totalFee = Math.max(0, basePrice - couponDiscount);
  const amountToPayNow = Math.ceil(totalFee / 2);
  const balanceFee = totalFee - amountToPayNow;

  const handleApplyCoupon = async () => {
    if (!formData.coupon_code.trim()) return;
    setValidatingCoupon(true);
    setCouponValidation(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.coupon_code.trim(),
          category: formData.category,
          price: basePrice,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponValidation({
          valid: true,
          discountAmount: data.discountAmount,
        });
      } else {
        setCouponValidation({
          valid: false,
          discountAmount: 0,
          error: data.error || 'Invalid coupon code',
        });
      }
    } catch {
      setCouponValidation({ valid: false, discountAmount: 0, error: 'Failed to validate coupon' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'category' && value === 'training') {
      setCouponValidation(null);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.dob ||
      !formData.address ||
      !formData.password ||
      !formData.category ||
      !formData.track_name ||
      !formData.mode ||
      !formData.duration
    ) {
      setErrorMsg('Please fill in all mandatory fields and select your internship options.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Phone number must be exactly 10 digits.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay Order
      const intentRes = await fetch('/api/auth/register-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const intentData = await intentRes.json();

      if (!intentRes.ok || !intentData.success) {
        if (intentData.unverified) {
          router.push(`/verify-email?email=${encodeURIComponent(intentData.email)}`);
          return;
        }
        throw new Error(intentData.error || 'Registration failed to initiate.');
      }

      // Step 2: Open Razorpay Checkout Modal
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please refresh and try again.');
      }

      const options = {
        key: intentData.keyId,
        amount: intentData.amount * 100, // paise
        currency: intentData.currency || 'INR',
        name: 'Altruisty Innovation Pvt Ltd',
        description: `50% Registration Fee - ${formData.category.toUpperCase()} (${formData.mode})`,
        image: '/logo.png',
        order_id: intentData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#1b449c',
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment Server-Side
            const verifyRes = await fetch('/api/auth/verify-registration-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                formData: {
                  ...formData,
                  phone: cleanPhone,
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            // Redirect to email verification page
            router.push(`/verify-email?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            setErrorMsg(verifyErr.message || 'Payment verification failed. Contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setErrorMsg('Payment cancelled. Your registration is not yet confirmed.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Registration submit error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Student Admission Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Internship Registration & Enrollment
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Complete your details below. Pay only <strong>50% initial fee</strong> now to secure your seat. Pay the remaining 50% upon internship completion!
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Error</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-8">
            {/* 1. Personal Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  1. Personal Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Please ensure all details match your official ID.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">A verification code will be sent to this email.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (10 digits) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Address *
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete communication address with city and pincode"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Select Internship & Mode */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  2. Internship Program Selection
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Select category, technical domain, mode, and duration.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Internship Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium"
                  >
                    <option value="">-- Select Category --</option>
                    <option value="project">Project Internship (Includes Industry Visit & Coupons)</option>
                    <option value="training">Training Internship (Skill Foundation)</option>
                  </select>
                </div>

                {/* Technical Domain */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Internship Domain / Track *
                  </label>
                  <select
                    name="track_name"
                    required
                    value={formData.track_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium"
                  >
                    <option value="">-- Select Domain / Track --</option>
                    {tracks.length > 0 ? (
                      tracks.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Python, AI & Machine Learning">Python, AI & Machine Learning</option>
                        <option value="Data Science & Business Analytics">Data Science & Business Analytics</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
                        <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mode of Internship *
                  </label>
                  <select
                    name="mode"
                    required
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium"
                  >
                    <option value="">-- Select Mode --</option>
                    <option value="online">Online (Live Google Meet Sessions)</option>
                    <option value="offline">Offline (In-Person Classroom Training)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duration *
                  </label>
                  <select
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white font-medium"
                  >
                    <option value="">-- Select Duration --</option>
                    {!formData.category ? (
                      <option value="" disabled>Please select category first</option>
                    ) : formData.category === 'project' ? (
                      <>
                        <option value="30days">30 Days (1 Month) — ₹1,999</option>
                        <option value="2month">2 Months — ₹2,799</option>
                      </>
                    ) : formData.mode === 'offline' ? (
                      <>
                        <option value="15days">15 Days — ₹699</option>
                        <option value="1month">1 Month — ₹999</option>
                        <option value="2month">2 Months — ₹1,799</option>
                      </>
                    ) : (
                      <>
                        <option value="15days">15 Days — ₹599</option>
                        <option value="1month">1 Month — ₹799</option>
                        <option value="2month">2 Months — ₹1,499</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Account Security (Password) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  3. Account Credentials
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Set a password to log in to your student dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 4. Referral & Coupon Codes */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  4. Referral & Coupons (Optional)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Apply coupon codes and enter friend referral codes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Referral Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Friend Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="referral_code"
                    value={formData.referral_code}
                    onChange={handleInputChange}
                    placeholder="e.g. ALT-A1B2C"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm uppercase"
                  />
                  <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
                    ✓ Both you and your friend get ₹25 deducted from the balance certificate fee!
                  </span>
                </div>

                {/* Coupon Code (Only for Project Internship) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Discount Coupon Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="coupon_code"
                      value={formData.coupon_code}
                      onChange={handleInputChange}
                      placeholder="Enter coupon code"
                      disabled={formData.category !== 'project'}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm uppercase disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={formData.category !== 'project' || validatingCoupon || !formData.coupon_code.trim()}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition-colors whitespace-nowrap"
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {formData.category === 'training' ? (
                    <span className="text-[11px] text-amber-600 mt-1 block">
                      Note: Discount coupons are not applicable for Training Internships.
                    </span>
                  ) : couponValidation?.valid ? (
                    <span className="text-[11px] text-emerald-600 mt-1 block font-bold">
                      ✓ Coupon Applied! Instant discount of ₹{couponValidation.discountAmount}
                    </span>
                  ) : couponValidation?.error ? (
                    <span className="text-[11px] text-rose-600 mt-1 block">
                      ✗ {couponValidation.error}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Available for Project Internships
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Payment Summary Box & Submit */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold">Payment Summary (50% Pay Later Scheme)</h3>
                  <p className="text-xs text-slate-400">Secure checkout via Razorpay</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" /> 100% Encrypted & Safe
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Program:</span>
                  <span className="font-semibold text-white">
                    {formData.track_name
                      ? `${formData.track_name} (${formData.category === 'project' ? 'Project' : 'Training'}${formData.mode ? `, ${formData.mode}` : ''})`
                      : 'Please select program'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Duration:</span>
                  <span className="font-semibold text-white capitalize">{formData.duration || 'Not selected'}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Base Program Fee:</span>
                  <span className="font-semibold text-white">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount:</span>
                    <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                  <span>Total Internship Fee:</span>
                  <span className="font-bold text-white text-base">₹{totalFee.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-sky-300">Amount Payable Now (50%):</span>
                    <span className="text-2xl font-black text-white">₹{amountToPayNow.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300 border-t border-blue-400/20 pt-2">
                    <span>Remaining Balance on Completion:</span>
                    <span className="font-bold text-amber-300">₹{balanceFee.toLocaleString('en-IN')}*</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    * The remaining balance is paid before receiving your certificate. Successful referrals deduct ₹25 each from this balance amount!
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-base text-white bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-sky-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Pay Initial 50% (₹{amountToPayNow})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <Link href="/login" className="text-sky-400 hover:underline font-bold">
                  Log in to your student dashboard
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading registration...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
