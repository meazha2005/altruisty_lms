'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Search, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyCertificateSearchPage() {
  const router = useRouter();
  const [certId, setCertId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify-certificate/${certId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Certificate Verification Portal
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Verify the authenticity of digital certificates issued by{' '}
              <strong>Altruisty Innovation Pvt Ltd</strong> for academic institutions, employers, and background verification.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. ALT-CERT-2026-0001)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold tracking-wide"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verify Credential Authenticity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tamper-Proof Verification</span>
            </div>
            <p>
              Each certificate carries a cryptographic verification hash tied to student enrollment, duration, and completion records in our central database.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
