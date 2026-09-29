'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Edit2,
  Lock,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Email Modal State
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      setMessage('Email verified successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setMessage(data.message || 'New OTP sent to your email.');
      setCooldown(45);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setResending(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: email.trim().toLowerCase(),
          newEmail: newEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update email');
      }

      setEmail(data.updatedEmail);
      setIsEditingEmail(false);
      setNewEmail('');
      setMessage(`Email successfully updated to ${data.updatedEmail}! A new verification code has been sent.`);
      setCooldown(45);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update email address');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Verify Your Email</h1>
            <p className="text-xs text-slate-500">
              We sent a 6-digit confirmation code to:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
              <span>{email || 'Your registered email'}</span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px]"
                title="Change wrong email address"
              >
                <Edit2 className="w-3 h-3" /> Change
              </button>
            </div>
          </div>

          {/* Change Email Form Accordion */}
          {isEditingEmail && (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3 animate-in fade-in">
              <p className="text-xs font-bold text-sky-900">
                Entered wrong email during registration? Correct it here:
              </p>
              <form onSubmit={handleChangeEmailSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter correct email address"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={resending}
                    className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    {resending ? 'Updating...' : 'Update & Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center text-2xl font-black tracking-widest text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email & Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend Action */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Did not receive the verification code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || cooldown > 0}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:text-slate-400 inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Verification Code'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-xs text-slate-500 hover:text-slate-800">
              Return to Student Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
