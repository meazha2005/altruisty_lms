'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-48 sm:w-56 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/logo.png"
                alt="Altruisty Innovation Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>


          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
            >
              <span>Login</span>
            </Link>

            {/* Apply Now button */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 shadow-sm shadow-blue-500/25 transition-all hover:shadow-md hover:shadow-blue-500/30"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg"
            >
              Apply
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#programs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Internship Programs
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Pricing & Durations
          </Link>
          <Link
            href="/#referral"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Refer & Earn (₹25 Off)
          </Link>
          <Link
            href="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Verify Certificate
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-center text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
