'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GallerySection from '@/components/GallerySection';
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
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  Laptop,
  MapPin,
  ShieldCheck,
  FileCheck,
  Clock,
  ArrowUpRight,
  Percent,
  BadgePercent,
  UserCheck,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface TrackItem {
  title: string;
  category: 'both' | 'project' | 'training';
  filter: 'web' | 'ai' | 'mobile' | 'core';
  desc: string;
  techStack: string[];
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  gradient: string;
}

export default function HomePage() {
  const router = useRouter();

  // Hero Interactive Preview Card State
  const [heroActiveTab, setHeroActiveTab] = useState<'class' | 'project' | 'cert' | 'referral'>('class');

  // Track Filter State
  const [trackFilter, setTrackFilter] = useState<'all' | 'web' | 'ai' | 'mobile' | 'core'>('all');

  // Pricing State
  const [pricingCategory, setPricingCategory] = useState<'project' | 'training'>('project');
  const [pricingMode, setPricingMode] = useState<'online' | 'offline'>('online');
  const [couponTestCode, setCouponTestCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Referral Calculator State
  const [referredCount, setReferredCount] = useState<number>(4);

  // Quick Certificate Verification Search
  const [certSearchId, setCertSearchId] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certSearchId.trim()) {
      router.push(`/verify-certificate/${certSearchId.trim().toUpperCase()}`);
    }
  };

  const tracks: TrackItem[] = [
    {
      title: 'Full Stack Web Development',
      category: 'both',
      filter: 'web',
      desc: 'Architect and deploy production web platforms with React, Next.js, Node.js, and PostgreSQL.',
      techStack: ['Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      icon: Code,
      badge: 'Most Popular',
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Python, AI & Machine Learning',
      category: 'both',
      filter: 'ai',
      desc: 'Build intelligent systems with neural networks, computer vision, and Generative AI LLM integrations.',
      techStack: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'Scikit-Learn'],
      icon: Brain,
      badge: 'High Demand',
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      title: 'Data Science & Business Analytics',
      category: 'both',
      filter: 'ai',
      desc: 'Convert raw big data into high-value executive dashboards, statistical models, and predictive analytics.',
      techStack: ['Python', 'Pandas', 'PowerBI', 'SQL', 'Tableau'],
      icon: Layers,
      badge: 'High ROI',
      gradient: 'from-cyan-600 to-sky-500',
    },
    {
      title: 'Mobile App Development',
      category: 'both',
      filter: 'mobile',
      desc: 'Build responsive, fluid iOS and Android mobile apps using cross-platform Flutter and React Native engines.',
      techStack: ['Flutter', 'React Native', 'Dart', 'Firebase', 'REST APIs'],
      icon: Smartphone,
      badge: 'Fast Track',
      gradient: 'from-sky-600 to-blue-600',
    },
    {
      title: 'Cyber Security & Ethical Hacking',
      category: 'both',
      filter: 'core',
      desc: 'Master hands-on penetration testing, network sniffing, exploit mitigation, and web application defenses.',
      techStack: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'OWASP'],
      icon: Shield,
      badge: 'Defense Tech',
      gradient: 'from-slate-700 to-blue-800',
    },
    {
      title: 'Cloud Computing & DevOps',
      category: 'both',
      filter: 'web',
      desc: 'Automate enterprise deployment pipelines with Docker containers, Kubernetes clusters, and AWS infrastructure.',
      techStack: ['AWS Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      icon: Cloud,
      badge: 'Enterprise Tech',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'UI/UX Design & Prototyping',
      category: 'both',
      filter: 'core',
      desc: 'Design intuitive design systems, responsive wireframes, interactive user journeys, and clickable Figma prototypes.',
      techStack: ['Figma', 'Wireframing', 'User Research', 'Design Systems'],
      icon: Palette,
      badge: 'Creative Tech',
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Embedded Systems & IoT',
      category: 'both',
      filter: 'core',
      desc: 'Program microcontrollers, integrate edge sensors, and engineer real-time connected smart IoT devices.',
      techStack: ['C/C++', 'Arduino', 'Raspberry Pi', 'MQTT', 'ESP32'],
      icon: Cpu,
      badge: 'Hardware & IoT',
      gradient: 'from-sky-600 to-cyan-600',
    },
  ];

  const filteredTracks = useMemo(() => {
    if (trackFilter === 'all') return tracks;
    return tracks.filter((t) => t.filter === trackFilter);
  }, [trackFilter]);

  const faqs = [
    {
      q: 'How does the 50% Pay-Later Policy work?',
      a: 'During registration, you only pay exactly 50% of the internship fee. The remaining 50% balance fee is payable only upon completion of your internship when unlocking your official, cryptographically verifiable certificate. You never pay 100% upfront.',
    },
    {
      q: 'What is included in the Project Internship vs Training Internship?',
      a: 'Project Internships include half-day live mentor training, half-day live production development on client projects, and 1 guaranteed Industry Visit (in-person in Chennai or virtual). Plus, promotional discount coupons can be applied! Training Internships focus on essential skill foundations without coupons.',
    },
    {
      q: 'How does the Student Referral Rewards program work?',
      a: 'Every student receives an exclusive referral code upon registration. Whenever a friend uses your code to register, BOTH you and your friend get an automatic ₹25 deduction from your remaining balance certificate fee! If you refer enough friends, your certificate balance can become ₹0.00!',
    },
    {
      q: 'How are online Google Meet sessions and offline classes scheduled?',
      a: 'Our mentors schedule sessions directly through the staff portal. Online students receive calendar notifications with direct Google Meet links. Offline students receive office reporting timings and workstation guidelines. All updates appear live in your student dashboard.',
    },
    {
      q: 'Can employers and universities verify my certificate?',
      a: 'Yes, 100%! Every certificate generated by Altruisty Innovation Pvt Ltd contains a unique credential ID and tamper-proof QR code. Anyone can scan the QR code or enter the ID on our public verification portal to view authenticated credential details.',
    },
    {
      q: 'What if I typed the wrong email address during registration?',
      a: 'No problem! On the email verification screen, there is a prominent "Change Email Address" option. Enter your correct address and our system will update your record and immediately send a fresh OTP.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: MODERN TECH LAUNCHPAD (FULL-SCREEN FIT)
        ======================================================== */}
        <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-5rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-0 bg-radial from-sky-50/80 via-white to-white">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-400/15 via-sky-300/20 to-cyan-300/15 blur-3xl pointer-events-none -z-10 rounded-full" />
          <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                {/* Announcement Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs font-semibold shadow-xs backdrop-blur-md">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </span>
                  <span className="tracking-wide">ALTRUISTY INNOVATION PVT LTD • ADMISSIONS OPEN 2026</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Launch Your Career With{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500">
                    Real-World Industry Internships
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Hands-on live coding, daily technical mentorship, guaranteed industry visit, and verifiable QR credentials.
                  <span className="block mt-1.5 font-bold text-slate-900">
                    Pay only 50% now at registration — pay the remaining 50% balance only upon completion!
                  </span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 hover:from-blue-800 hover:to-sky-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Apply Now (Pay 50% Later)</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="#pricing"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all duration-200 hover:border-slate-300"
                  >
                    <BadgePercent className="w-4 h-4 text-sky-600" />
                    <span>View Pricing & Plans</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50% Pay Later Scheme</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>1 Industry Visit Included</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Verifiable QR Certificate</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Live Platform Showcase */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Floating Metric 1 */}
                  <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-float-slow">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">4.9 / 5 Rating</div>
                      <div className="text-[10px] text-slate-500">1,200+ Student Reviews</div>
                    </div>
                  </div>

                  {/* Floating Metric 2 */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-4 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-float-reverse">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">₹25 Referral Reward</div>
                      <div className="text-[10px] text-slate-500">Deducted from balance fee</div>
                    </div>
                  </div>

                  {/* Main Glassmorphic Showcase Box */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
                    {/* Top window dots & status */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono text-slate-400 ml-2">altruisty-lms-v2.6</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System
                      </span>
                    </div>

                    {/* Interactive Tab Selectors */}
                    <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-xl mb-4 text-[11px] font-semibold">
                      <button
                        onClick={() => setHeroActiveTab('class')}
                        className={`py-1.5 rounded-lg transition-all ${
                          heroActiveTab === 'class' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Classes
                      </button>
                      <button
                        onClick={() => setHeroActiveTab('project')}
                        className={`py-1.5 rounded-lg transition-all ${
                          heroActiveTab === 'project' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Project
                      </button>
                      <button
                        onClick={() => setHeroActiveTab('cert')}
                        className={`py-1.5 rounded-lg transition-all ${
                          heroActiveTab === 'cert' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Certificate
                      </button>
                      <button
                        onClick={() => setHeroActiveTab('referral')}
                        className={`py-1.5 rounded-lg transition-all ${
                          heroActiveTab === 'referral' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Referral
                      </button>
                    </div>

                    {/* Tab 1: Live Class Preview */}
                    {heroActiveTab === 'class' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                            <span className="flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5" /> Upcoming Live Session
                            </span>
                            <span className="bg-sky-500/20 px-2 py-0.5 rounded text-[10px] text-sky-300">Today 10:00 AM</span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            Microservices, REST APIs & Cloud Deployment
                          </h4>
                          <p className="text-xs text-slate-400">
                            Batch: <span className="text-slate-200 font-medium">FullStack-Alpha-2026 (Online)</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                              GM
                            </div>
                            <span className="text-xs text-slate-300 font-mono">meet.google.com/alt-live</span>
                          </div>
                          <span className="text-[11px] font-bold text-sky-400">Emailed Automatically</span>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center">
                          ✓ Automated calendar invites & notifications are delivered to all students.
                        </p>
                      </div>
                    )}

                    {/* Tab 2: Project Development Preview */}
                    {heroActiveTab === 'project' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5" /> Milestone 3 Progress
                            </span>
                            <span className="text-xs font-bold text-white">85% Complete</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                          </div>
                          <div className="text-xs text-slate-300 space-y-1">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Database Schema & Authentication API</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Stripe / Razorpay Payment Integration</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                              <span>Docker Containerization & CI/CD Pipeline</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {['React 19', 'Next.js 15', 'Node.js', 'PostgreSQL', 'Docker'].map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Verified Certificate Preview */}
                    {heroActiveTab === 'cert' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md space-y-1.5 text-center">
                          <div className="relative h-6 w-28 mx-auto">
                            <Image src="/logo.png" alt="Altruisty" fill className="object-contain" priority />
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                            CERTIFICATE OF INTERNSHIP
                          </div>
                          <div className="text-sm font-bold text-slate-900">Arun Kumar S.</div>
                          <div className="text-[11px] text-slate-500">
                            Full Stack Web Development • 30 Days Project Internship
                          </div>
                          <div className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                            ID: ALT-2026-X89K • VERIFIED & SIGNED
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center">
                          Instant verification via public QR code and cryptographic ID lookup.
                        </p>
                      </div>
                    )}

                    {/* Tab 4: Referral Reward Preview */}
                    {heroActiveTab === 'referral' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-blue-900/60 border border-indigo-400/30 space-y-2 text-center">
                          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Your Unique Code: ALT-S924B
                          </div>
                          <div className="text-2xl font-black text-white">
                            -₹100 <span className="text-xs text-sky-200 font-normal">Deducted from balance!</span>
                          </div>
                          <p className="text-xs text-slate-300">
                            4 Friends joined through your code! Both you and each friend save ₹25 each on certificate issuance.
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 text-center">
                          Invite enough classmates and your certificate fee can become ₹0!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle scroll indicator */}
          <div className="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center pointer-events-auto">
            <a
              href="#programs"
              className="flex flex-col items-center gap-1 group text-slate-400 hover:text-blue-600 transition-colors"
              aria-label="Scroll to explore programs"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 group-hover:text-blue-600 transition-colors">
                Explore Programs
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 animate-bounce transition-colors" />
            </a>
          </div>
        </section>

        {/* ========================================================
            TRUST METRICS COUNTER BAR
        ======================================================== */}
        <section className="border-y border-slate-200 bg-slate-50/70 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-blue-900">500+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">Students Trained & Placed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-blue-900">50%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">Pay-Later Safety Model</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-blue-900">1 Guaranteed</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">Industry Visit Per Project Batch</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-blue-900">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">Verifiable QR Credentials</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERNSHIP DOMAIN EXPLORER
        ======================================================== */}
        <section id="programs" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                Industry-Aligned Curriculums
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Choose Your Technical Internship Domain
              </h2>
              <p className="text-base text-slate-600">
                All 8 technical tracks are available in <strong className="text-slate-900 font-bold">both Project Internship</strong> (includes live development, 1 Industry Visit & coupons) and <strong className="text-slate-900 font-bold">Training Internship</strong> (skill foundation) formats.
              </p>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { id: 'all', label: 'All Tracks (8)' },
                  { id: 'web', label: 'Web & Cloud' },
                  { id: 'ai', label: 'AI & Data Science' },
                  { id: 'mobile', label: 'Mobile Apps' },
                  { id: 'core', label: 'Security & IoT' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTrackFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      trackFilter === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Track Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTracks.map((track, idx) => {
                const IconComponent = track.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top icon and badge */}
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

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {track.desc}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {track.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/register?track=${encodeURIComponent(track.title)}&cat=project`}
                          className="py-2 px-2 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Project</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/register?track=${encodeURIComponent(track.title)}&cat=training`}
                          className="py-2 px-2 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Training</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            PRICING & PLANS SECTION (CORE BUSINESS FEATURE)
        ======================================================== */}
        <section id="pricing" className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Transparent Fee Structure
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Internship Plans & Pricing Details
              </h2>
              <p className="text-base text-slate-600">
                Pay only 50% now to confirm your enrollment. Pay the balance only after completing your internship to receive your verified certificate!
              </p>

              {/* Master Category Switcher */}
              <div className="inline-flex flex-wrap p-1.5 bg-slate-200/80 rounded-2xl gap-1 mt-4">
                <button
                  onClick={() => setPricingCategory('project')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    pricingCategory === 'project'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  🚀 Project Internship (Includes Industry Visit & Coupons)
                </button>
                <button
                  onClick={() => setPricingCategory('training')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    pricingCategory === 'training'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  📚 Training Internship (Skill Foundation)
                </button>
              </div>
            </div>

            {/* TAB 1: PROJECT INTERNSHIP */}
            {pricingCategory === 'project' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Project Internship Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800/40">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                      <Sparkles className="w-3.5 h-3.5" /> Project Internship Exclusive Feature
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      Half-Day Live Training + Half-Day Project Development + 1 Industry Visit!
                    </h3>
                    <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
                      Real software team environment. Work under senior mentors on real project repos. Discount coupons can be applied at checkout!
                    </p>
                  </div>

                  {/* Interactive Coupon Box */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-sky-200">Active Coupon Code</span>
                    <div className="text-2xl font-black text-amber-300 tracking-wider my-0.5">ALTRUISTY200</div>
                    <span className="text-[11px] text-sky-100 block">Get ₹200 OFF instantly</span>
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Online 30 Days */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          Online GMeet
                        </span>
                        <span className="text-xs font-semibold text-slate-500">30 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Project Internship</h4>
                      <p className="text-xs text-slate-500 mb-4">Daily mentor guidance & coding sessions</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹1,999</span>
                          <span className="text-xs text-slate-500 font-semibold">total</span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 inline-block">
                          Pay ₹1,000 now • ₹999 at completion
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
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
                          <span>Discount coupons valid</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verifiable QR completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=online&dur=30days"
                      className="w-full py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                    >
                      Enroll Online (Pay ₹1,000)
                    </Link>
                  </div>

                  {/* Online 2 Months */}
                  <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 flex flex-col justify-between shadow-xl relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Online GMeet
                        </span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Advanced Project Track</h4>
                      <p className="text-xs text-slate-500 mb-4">Complete production capstone</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹2,799</span>
                          <span className="text-xs text-slate-500 font-semibold">total</span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 inline-block">
                          Pay ₹1,400 now • ₹1,399 at completion
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Advanced production capstone</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 Industry Visit Included</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Discount coupons valid</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Letter of Recommendation (LOR)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verifiable QR completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=online&dur=2month"
                      className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 rounded-xl transition-all shadow-md shadow-blue-500/25"
                    >
                      Enroll Online (Pay ₹1,400)
                    </Link>
                  </div>

                  {/* Offline 30 Days */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Chennai
                        </span>
                        <span className="text-xs font-semibold text-slate-500">30 Days</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Office Bootcamp</h4>
                      <p className="text-xs text-slate-500 mb-4">In-person training center facility</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹1,999</span>
                          <span className="text-xs text-slate-500 font-semibold">total</span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                          Pay ₹1,000 now • ₹999 at completion
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Classroom workstation access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 In-Person Industry Visit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Discount coupons valid</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Face-to-face mentor review</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verifiable QR completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=offline&dur=30days"
                      className="w-full py-3 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Enroll Offline (Pay ₹1,000)
                    </Link>
                  </div>

                  {/* Offline 2 Months */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Chennai
                        </span>
                        <span className="text-xs font-semibold text-slate-500">2 Months</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Flagship Residency</h4>
                      <p className="text-xs text-slate-500 mb-4">Complete software immersion</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">₹2,799</span>
                          <span className="text-xs text-slate-500 font-semibold">total</span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                          Pay ₹1,400 now • ₹1,399 at completion
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Dedicated workstation facility</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>1 In-Person Industry Visit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Discount coupons valid</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Direct job placement guidance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Verifiable QR completion certificate</span>
                        </li>
                      </ul>
                    </div>

                    <Link
                      href="/register?cat=project&mode=offline&dur=2month"
                      className="w-full py-3 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Enroll Offline (Pay ₹1,400)
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRAINING INTERNSHIP */}
            {pricingCategory === 'training' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center text-xs sm:text-sm text-blue-900 font-medium">
                  💡 Training internships offer essential hands-on foundations. No discount coupons are applicable for training internships. Pay only 50% at registration!
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Online 15 Days */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          Online GMeet
                        </span>
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
                  <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 flex flex-col justify-between shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                      Popular Online
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          Online GMeet
                        </span>
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
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          Online GMeet
                        </span>
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
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Chennai
                        </span>
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
                  <div className="bg-white rounded-3xl border-2 border-amber-500 p-6 flex flex-col justify-between shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                      Popular Offline
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Chennai
                        </span>
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
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Chennai
                        </span>
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

        {/* ========================================================
            "WHY ALTRUISTY" - SIDE-BY-SIDE COMPARISON MATRIX
        ======================================================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                The Altruisty Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Why Thousands Choose Altruisty
              </h2>
              <p className="text-base text-slate-600">
                Compare our student-centric internship framework against conventional generic online courses.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="py-4 px-6 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Feature / Policy
                      </th>
                      <th className="py-4 px-6 text-xs font-black uppercase text-blue-700 tracking-wider bg-blue-50/70 border-x border-blue-100">
                        Altruisty Innovation Pvt Ltd
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">
                        Conventional Internships
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-800">Payment Safety</td>
                      <td className="py-4 px-6 font-bold text-emerald-700 bg-blue-50/40 border-x border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pay 50% now • 50% on completion</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">100% full payment upfront</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-800">Learning Format</td>
                      <td className="py-4 px-6 font-bold text-emerald-700 bg-blue-50/40 border-x border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Live mentor GMeet + Classroom center</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">Outdated pre-recorded video playlists</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-800">Industry Exposure</td>
                      <td className="py-4 px-6 font-bold text-emerald-700 bg-blue-50/40 border-x border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>1 Guaranteed Industry Visit</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">No industry exposure</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-800">Credential Integrity</td>
                      <td className="py-4 px-6 font-bold text-emerald-700 bg-blue-50/40 border-x border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tamper-proof verifiable QR code & ID</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">Static unverifiable PDF certificate</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-800">Referral Rewards</td>
                      <td className="py-4 px-6 font-bold text-emerald-700 bg-blue-50/40 border-x border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>₹25 off certificate balance per friend</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">No student rewards scheme</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS (4-STEP CONNECTED TIMELINE)
        ======================================================== */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Seamless Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How Your Internship Journey Works
              </h2>
              <p className="text-base text-slate-600">
                A simple 4-step roadmap engineered for maximum convenience and academic recognition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 relative shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Register & Pay 50%</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your registration details and book your seat by paying only 50% through secure Razorpay.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 relative shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-sky-500/20">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">OTP Email Verification</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Confirm your email via a 6-digit OTP. You can update your email if there was a typo during signup!
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 relative shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Batch & Live Mentorship</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mentors assign your batch. Receive calendar emails with Google Meet links or office center reporting timings.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 relative shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                  4
                </div>
                <h3 className="text-base font-bold text-slate-900">Clear Balance & Certify</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Referral rewards (₹25/friend) reduce your balance. Clear the remaining fee and instantly download your verified QR credential!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            LIVE CERTIFICATE VERIFICATION WIDGET
        ======================================================== */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Public Credential Verification Portal</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Verify Any Altruisty Certificate Instantly
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Employers, university registrars, and students can authenticate certificate validity using our tamper-proof verification engine.
            </p>

            <form onSubmit={handleVerifySearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={certSearchId}
                  onChange={(e) => setCertSearchId(e.target.value.toUpperCase())}
                  placeholder="e.g. ALT-2026-X89K"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono uppercase bg-slate-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                Verify Credential
              </button>
            </form>
          </div>
        </section>

        {/* ========================================================
            REFERRAL REWARDS SIMULATOR BANNER
        ======================================================== */}
        <section id="referral" className="py-20 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Student Referral Rewards Program</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                  Earn ₹25 Discount For Every Friend You Invite!
                </h2>
                <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
                  Every registered student receives a personal referral code. For each classmate who signs up using your code, <strong>both you and your friend get ₹25 deducted</strong> from your remaining balance certificate fee!
                </p>
                <div className="flex items-center gap-3 text-xs text-sky-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>No referral limit — your certificate balance can literally become <strong>₹0.00</strong>!</span>
                </div>
              </div>

              {/* Interactive Rewards Calculator */}
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full shrink-0 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Referral Calculator</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Live Simulator</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Number of Friends Invited:</span>
                    <span className="text-blue-600 text-sm font-black">{referredCount} Friends</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={referredCount}
                    onChange={(e) => setReferredCount(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2 text-center">
                  <span className="text-xs font-semibold text-slate-600">Total Balance Fee Deduction:</span>
                  <div className="text-3xl font-black text-blue-700">
                    -₹{(referredCount * 25).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    ✓ Your friends also save ₹{(referredCount * 25).toLocaleString('en-IN')} in total!
                  </span>
                </div>

                <Link
                  href="/register"
                  className="w-full py-3.5 block text-center font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/25"
                >
                  Join & Get Your Code
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            LIFE AT ALTRUISTY - EVENT, TRAINING & CERTIFICATION GALLERY
        ======================================================== */}
        <GallerySection />

        {/* ========================================================
            STUDENT REVIEWS & TESTIMONIALS
        ======================================================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                Student Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Trusted by 500+ Aspiring Engineers
              </h2>
              <p className="text-base text-slate-600">
                Read authentic feedback from students who transformed their portfolios and received verified credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Nithya R.',
                  college: 'Anna University, Chennai',
                  track: 'Full Stack Web Development',
                  quote:
                    'The 50% pay-later policy gave me the confidence to enroll. Building a live full-stack capstone with Next.js and Docker helped me clear my campus technical interview with ease!',
                  rating: 5,
                },
                {
                  name: 'Karthik V.',
                  college: 'SRM Institute of Science & Technology',
                  track: 'Python, AI & Machine Learning',
                  quote:
                    'The industry visit was an eye-opener. Seeing how AI models are deployed into production workflows gave practical clarity that academic textbooks never taught us.',
                  rating: 5,
                },
                {
                  name: 'Sneha M.',
                  college: 'VIT Chennai',
                  track: 'Cyber Security & Ethical Hacking',
                  quote:
                    'I invited 6 friends from my department, and the system automatically deducted ₹150 from my final certificate fee! The QR verification on my certificate works instantly.',
                  rating: 5,
                },
              ].map((rev, idx) => (
                <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{rev.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                      <p className="text-[11px] text-slate-500">{rev.college}</p>
                      <span className="text-[10px] font-semibold text-blue-600 block">{rev.track}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE FAQS ACCORDION
        ======================================================== */}
        <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                Clear Answers
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600">
                Everything you need to know about enrollment, payment schemes, classes, and certification.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            CLOSING HIGH-IMPACT CTA BANNER
        ======================================================== */}
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold border border-blue-400/30">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Limited Batch Seats Available</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready To Accelerate Your Engineering Career?
            </h2>

            <p className="text-base text-slate-300 max-w-xl mx-auto">
              Join Altruisty Innovation today. Pay only 50% now, gain hands-on production skills, and settle the remaining half only upon completion!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                <span>Register Now (Pay 50% Later)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>Student Login</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
