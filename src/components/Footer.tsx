import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white px-3.5 py-2.5 rounded-xl inline-block shadow-sm">
              <div className="relative h-10 w-48 sm:w-52">
                <Image
                  src="/logo.png"
                  alt="Altruisty Innovation Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              <strong>ALTRUISTY INNOVATION PVT LTD</strong> is a premier tech incubation and skills launchpad bridging the gap between academia and industry. Nurturing future software engineers, AI researchers, and startup founders.
            </p>
          </div>

          {/* Quick Links */}
          <div>            
          </div>


          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Chennai, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+918667839838" className="hover:text-sky-400 transition-colors">
                  +91 8667839838
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:altruistybusiness@gmail.com" className="hover:text-sky-400 transition-colors">
                  altruistybusiness@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ALTRUISTY INNOVATION PVT LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
