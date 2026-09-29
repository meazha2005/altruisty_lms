'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Code,
  Cpu,
  Brain,
  Shield,
  Smartphone,
  Cloud,
  Palette,
  Layers,
  CheckCircle2,
  Calendar,
  Award,
  Video,
  Building2,
  Users2,
  ArrowRight,
  Search,
  Sparkles,
  Gift,
  HelpCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'training' | 'project'>('project');
  const [certSearchId, setCertSearchId] = useState('');

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certSearchId.trim()) {
      router.push(`/verify-certificate/${certSearchId.trim().toUpperCase()}`);
    }
  };

  const tracks = [
    {
      title: 'Full Stack Web Development',
      category: 'project',
      desc: 'Build scalable modern web applications using React, Next.js, Node.js, and SQL/NoSQL databases with live cloud deployment.',
      icon: Code,
      badge: 'Most Popular',
    },
    {
      title: 'Python, AI & Machine Learning',
      category: 'project',
      desc: 'Harness predictive machine learning algorithms, deep neural networks, and modern Generative AI integrations.',
      icon: Brain,
      badge: 'High Demand',
    },
    {
      title: 'Data Science & Analytics',
      category: 'project',
      desc: 'Extract actionable business insights from big data using Pandas, SQL, visualization dashboards, and statistical models.',
      icon: Layers,
      badge: 'Industry Essential',
    },
    {
      title: 'Mobile App Development',
      category: 'project',
      desc: 'Create smooth cross-platform applications for iOS & Android with Flutter and React Native.',
      icon: Smartphone,
      badge: 'Fast Track',
    },
    {
      title: 'Cyber Security & Ethical Hacking',
      category: 'training',
      desc: 'Master network penetration testing, web vulnerability hunting, and defense against real-world cyber threats.',
      icon: Shield,
      badge: 'Core Security',
    },
    {
      title: 'Cloud Computing & DevOps',
      category: 'training',
      desc: 'Deploy high-availability systems with AWS, Docker containers, Kubernetes, and automated CI/CD pipelines.',
      icon: Cloud,
      badge: 'Enterprise Tech',
    },
    {
      title: 'UI/UX Design & Prototyping',
      category: 'training',
      desc: 'Design beautiful, user-centered digital products, wireframes, design systems, and Figma prototypes.',
      icon: Palette,
      badge: 'Creative Tech',
    },
    {
      title: 'Embedded Systems & IoT',
      category: 'training',
      desc: 'Program microcontrollers, integrate sensors, and build smart internet-connected hardware architectures.',
      icon: Cpu,
      badge: 'Hardware & IoT',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-sky-50/60 via-white to-white">
          <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>ALTRUISTY INNOVATION PVT LTD • ADMISSIONS OPEN 2026</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Launch Your Tech Career With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500">
                  Real-World Industry Internships
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
                Gain verified industry experience through live online mentor sessions or in-person classroom training.
                <br />
                <span className="font-semibold text-slate-800">
                  Pay only 50% now at registration — settle the remaining 50% only upon completion!
                </span>
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>Apply Now (Pay 50% Later)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="#pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
                >
                  <span>View Pricing & Tracks</span>
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* INTERNSHIP PROGRAMS SECTION */}
        <section id="programs" className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                Specialized Learning Paths
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Choose Your Internship Domain
              </h2>
              <p className="text-base text-slate-600">
                Whether you want focused skill foundation in a Training Internship or intensive real-world development in a Project Internship, we have cutting-edge tracks tailored for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tracks.map((track, idx) => {
                const IconComponent = track.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {track.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 capitalize">
                        {track.category} Track
                      </span>
                      <Link
                        href={`/register?track=${encodeURIComponent(track.title)}&cat=${track.category}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Apply <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING & TIERS SECTION */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Internship Plans & Pricing Details
              </h2>
              <p className="text-base text-slate-600">
                Pay half now to confirm your enrollment. Pay the balance only after completing your internship to receive your verifiable certificate.
              </p>

              {/* Tabs Switcher */}
              <div className="inline-flex p-1.5 bg-slate-100 rounded-xl mt-4">
                <button
                  onClick={() => setActiveTab('project')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'project'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🚀 Project Internship (Includes Industry Visit & Coupons)
                </button>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'training'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📚 Training Internship (Skill Foundation)
                </button>
              </div>
            </div>

            {/* TAB 1: PROJECT INTERNSHIP */}
            {activeTab === 'project' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Special Highlight Box */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                      <Sparkles className="w-3.5 h-3.5" /> Project Internship Exclusive Feature
                    </div>
                    <h3 className="text-2xl font-extrabold">
                      Half-Day Training + Half-Day Live Project Development + 1 Industry Visit!
                    </h3>
                    <p className="text-sm text-sky-100 max-w-2xl">
                      Experience actual IT industry workflows. Work under experienced industry mentors on real client projects. Valid discount coupons can be applied at checkout!
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center shrink-0">
                    <span className="text-xs font-semibold text-sky-200">Active Coupon Code</span>
                    <div className="text-xl font-black text-amber-300 tracking-wider">ALTRUISTY200</div>
                    <span className="text-[11px] text-sky-100">Get ₹200 OFF instantly</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Online 30 Days */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                          Online
                        </span>
                        <span className="text-xs font-semibold text-slate-500">30 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Project Internship</h4>
                      <p className="text-xs text-slate-500 mb-4">Daily live mentor sessions & coding</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹1,999</span>
                          <span className="text-xs text-slate-500">total</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                          Pay ₹1,000 now • ₹999 at completion
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Half days live training</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Half days project development</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 Virtual Industry Visit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Coupons applicable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verified completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=online&dur=30days"
                      className="w-full py-2.5 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                    >
                      Enroll Online (Pay ₹1,000)
                    </Link>
                  </div>

                  {/* Online 2 Months */}
                  <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 flex flex-col justify-between shadow-lg relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                          Online
                        </span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Advanced Project Track</h4>
                      <p className="text-xs text-slate-500 mb-4">Complete production deployment</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹2,799</span>
                          <span className="text-xs text-slate-500">total</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                          Pay ₹1,400 now • ₹1,399 at completion
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Production capstone project</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 Industry Visit / Interaction</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Coupons applicable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Letter of Recommendation (LOR)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verified completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=online&dur=2month"
                      className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 rounded-xl transition-all shadow-sm"
                    >
                      Enroll Online (Pay ₹1,400)
                    </Link>
                  </div>

                  {/* Offline 30 Days */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                          Offline Chennai
                        </span>
                        <span className="text-xs font-semibold text-slate-500">30 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Office Bootcamp</h4>
                      <p className="text-xs text-slate-500 mb-4">In-person training center</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹1,999</span>
                          <span className="text-xs text-slate-500">total</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                          Pay ₹1,000 now • ₹999 at completion
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Classroom + office lab workstation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 In-Person Industry Visit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Coupons applicable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Face-to-face mentorship</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verified completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=offline&dur=30days"
                      className="w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Enroll Offline (Pay ₹1,000)
                    </Link>
                  </div>

                  {/* Offline 2 Months */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                          Offline Chennai
                        </span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Flagship Residency</h4>
                      <p className="text-xs text-slate-500 mb-4">Full developer immersion</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹2,799</span>
                          <span className="text-xs text-slate-500">total</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                          Pay ₹1,400 now • ₹1,399 at completion
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Dedicated workstation access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 In-Person Industry Visit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Coupons applicable</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Direct job placement guidance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verified completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=offline&dur=2month"
                      className="w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Enroll Offline (Pay ₹1,400)
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRAINING INTERNSHIP */}
            {activeTab === 'training' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center text-sm text-slate-700">
                  <span className="font-bold text-blue-700">Note:</span> Training internships offer essential hands-on foundations. No discount coupons are applicable for training internships. Pay only 50% at registration!
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Online 15 Days */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">Online</span>
                        <span className="text-xs font-semibold text-slate-500">15 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">15-Day Fast Track</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹599</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">Pay ₹300 now • ₹299 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Quick crash course with practical assignments.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=online&dur=15days"
                      className="w-full py-2.5 text-center text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      Register (Pay ₹300)
                    </Link>
                  </div>

                  {/* Online 1 Month */}
                  <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 flex flex-col justify-between shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                      Popular Online
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">Online</span>
                        <span className="text-xs font-semibold text-slate-500">1 Month</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">1-Month Foundation</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹799</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">Pay ₹400 now • ₹399 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Complete concept breakdown and guided coding.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=online&dur=1month"
                      className="w-full py-2.5 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                    >
                      Register (Pay ₹400)
                    </Link>
                  </div>

                  {/* Online 2 Month */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800">Online</span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">2-Month Comprehensive</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹1,499</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">Pay ₹750 now • ₹749 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Extensive modules and hands-on assignments.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=online&dur=2month"
                      className="w-full py-2.5 text-center text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      Register (Pay ₹750)
                    </Link>
                  </div>

                  {/* Offline 15 Days */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">Offline</span>
                        <span className="text-xs font-semibold text-slate-500">15 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Offline Sprint</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹699</div>
                        <div className="text-xs font-bold text-amber-700 mt-1">Pay ₹350 now • ₹349 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">In-person classroom sprint with trainer guidance.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=offline&dur=15days"
                      className="w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Register (Pay ₹350)
                    </Link>
                  </div>

                  {/* Offline 1 Month */}
                  <div className="bg-white rounded-2xl border-2 border-amber-500 p-6 flex flex-col justify-between shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                      Popular Offline
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">Offline</span>
                        <span className="text-xs font-semibold text-slate-500">1 Month</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Offline In-Person Track</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹999</div>
                        <div className="text-xs font-bold text-amber-700 mt-1">Pay ₹500 now • ₹499 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Workstation access and in-person mentorship.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=offline&dur=1month"
                      className="w-full py-2.5 text-center text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
                    >
                      Register (Pay ₹500)
                    </Link>
                  </div>

                  {/* Offline 2 Month */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">Offline</span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Offline Mastery</h4>
                      <div className="my-4">
                        <div className="text-3xl font-black text-slate-900">₹1,799</div>
                        <div className="text-xs font-bold text-amber-700 mt-1">Pay ₹900 now • ₹899 at completion</div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Full in-depth syllabus with mock interview preparation.</p>
                    </div>
                    <Link
                      href="/register?cat=training&mode=offline&dur=2month"
                      className="w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Register (Pay ₹900)
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS (4-STEP TIMELINE) */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Seamless Student Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                How Your Altruisty Internship Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Register & Pay 50%</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your registration details and pay only 50% of the internship fee via secure Razorpay checkout.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Email OTP Verification</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Receive a 6-digit verification code in your email. If you made a typo, you can easily change your email address.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Join Batch & Classes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mentors assign your batch. Receive automated calendar emails with Google Meet links (online) or office timings (offline).
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mb-4">
                  4
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Settle Balance & Certify</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Referral discounts (₹25/referral) reduce your balance fee. Pay the remaining half and receive your verified certificate!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REFERRAL PROGRAM BANNER */}
        <section id="referral" className="py-16 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Student Referral Rewards Program</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                  Earn ₹25 Discount For Every Friend You Invite!
                </h2>
                <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                  Every registered student receives a unique referral code. For each successful friend who registers and completes their initial half payment, <strong>both you and your friend get ₹25 deducted</strong> from your remaining balance fee payable for your certificate!
                </p>
              </div>

              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full shrink-0">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Discount Logic</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Automatic</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Your Friend (Referee):</span>
                    <strong className="text-emerald-600">-₹25 off balance fee</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">You (Referrer):</span>
                    <strong className="text-emerald-600">-₹25 off balance fee / friend</strong>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl text-xs text-sky-900 border border-sky-100">
                    💡 If you refer enough friends, your remaining balance fee can even become <strong>₹0.00</strong>!
                  </div>
                </div>
                <Link
                  href="/register"
                  className="mt-6 w-full py-3 block text-center font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Join & Get Your Code
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Everything You Need To Know
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2">How does the 50% payment policy work?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  During registration, you only pay half (50%) of the total internship fee. The remaining balance amount is payable upon completion of your internship to generate and unlock your official verifiable certificate.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2">What if I typed the wrong email address during registration?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No worries! On the email verification page, simply click the "Change Email Address" option, enter your correct email, and our system will update your record and immediately send a new OTP.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2">How do I receive Google Meet links for online batches?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our staff and mentors schedule sessions through their portal calendar. As soon as a session is scheduled, you receive an automated email with the session topic, date, timings, and clickable Google Meet link. It also shows up on your student dashboard.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2">How do offline internship sessions work?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Offline classroom sessions and in-person industry visits are conducted at our authorized training facilities. Venue instructions are communicated directly by your mentor upon batch scheduling.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2">Can anyone verify my certificate?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Yes! Every certificate issued by Altruisty Innovation Pvt Ltd contains a unique verifiable credential ID and QR code. Employers and university authorities can verify it on our public verification portal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
