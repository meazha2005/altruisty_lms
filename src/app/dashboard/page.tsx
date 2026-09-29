'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import CompletionCertificatePreview from '@/components/CompletionCertificatePreview';
import OfferLetterPreview from '@/components/OfferLetterPreview';
import {
  GraduationCap,
  Calendar,
  Video,
  MapPin,
  Gift,
  Award,
  CreditCard,
  User,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  LogOut,
  Loader2,
  Sparkles,
  Building2,
  Menu,
  X,
  Download,
  FileDown,
  FileText,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<'pdf' | 'png' | null>(null);
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'classes' | 'profile' | 'offer' | 'certificate'>('classes');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Copy referral status
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Balance Payment
  const [payingBalance, setPayingBalance] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Certificate QR Code
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  // Responsive Scalers for A4 Documents
  const certContainerRef = useRef<HTMLDivElement>(null);
  const [certScale, setCertScale] = useState(1);
  const offerContainerRef = useRef<HTMLDivElement>(null);
  const [offerScale, setOfferScale] = useState(1);

  useEffect(() => {
    const updateScales = () => {
      if (certContainerRef.current) {
        const avail = certContainerRef.current.clientWidth - 16;
        setCertScale(Math.min(avail / 794, 1));
      }
      if (offerContainerRef.current) {
        const avail = offerContainerRef.current.clientWidth - 16;
        setOfferScale(Math.min(avail / 794, 1));
      }
    };
    updateScales();
    window.addEventListener('resize', updateScales);
    return () => window.removeEventListener('resize', updateScales);
  }, [activeTab, data]);

  const handleDownloadCertPDF = async () => {
    if (!data?.certificate) return;

    try {
      setDownloading('pdf');

      // Attempt high-res server PDF download first
      const res = await fetch('/api/student/certificate-pdf');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const sanitizedName = (data?.student?.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
        const link = document.createElement('a');
        link.href = url;
        link.download = `Altruisty_Certificate_${sanitizedName}_${data.certificate.certificate_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
      throw new Error('Server download unavailable, falling back');
    } catch (err: any) {
      console.warn('Falling back to client-side PDF capture:', err);
      const certElement = document.getElementById('completion-certificate-preview');
      if (!certElement) {
        window.print();
        return;
      }

      try {
        const { toPng } = await import('html-to-image');
        const { jsPDF } = await import('jspdf');

        const dataUrl = await toPng(certElement, {
          quality: 1,
          pixelRatio: 2.5,
          backgroundColor: '#ffffff',
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [794, 1123],
          compress: true,
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, 794, 1123, undefined, 'FAST');
        const sanitizedName = (data?.student?.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
        pdf.save(`Altruisty_Certificate_${sanitizedName}_${data.certificate.certificate_id}.pdf`);
      } catch (clientErr) {
        console.error('Failed client-side PDF capture:', clientErr);
        window.print();
      }
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadCertPNG = async () => {
    const certElement = document.getElementById('completion-certificate-preview');
    if (!certElement || !data?.certificate) return;

    try {
      setDownloading('png');
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(certElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const sanitizedName = (data?.student?.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Altruisty_Certificate_${sanitizedName}_${data.certificate.certificate_id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Failed to download certificate as PNG', err);
      window.print();
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadOfferPDF = async () => {
    if (!data?.student) return;

    try {
      setDownloading('pdf');

      // Attempt high-res server PDF download first
      const res = await fetch('/api/student/offer-letter');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const sanitizedName = (data.student.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
        const link = document.createElement('a');
        link.href = url;
        link.download = `Altruisty_Offer_Letter_${sanitizedName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
      throw new Error('Server download unavailable, falling back');
    } catch (err: any) {
      console.warn('Falling back to client-side PDF capture:', err);
      const offerElement = document.getElementById('offer-letter-preview');
      if (!offerElement) {
        window.print();
        return;
      }

      try {
        const { toPng } = await import('html-to-image');
        const { jsPDF } = await import('jspdf');

        const dataUrl = await toPng(offerElement, {
          quality: 1,
          pixelRatio: 2.5,
          backgroundColor: '#ffffff',
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [794, 1123],
          compress: true,
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, 794, 1123, undefined, 'FAST');
        const sanitizedName = (data.student.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
        pdf.save(`Altruisty_Offer_Letter_${sanitizedName}.pdf`);
      } catch (clientErr) {
        console.error('Failed client-side PDF capture:', clientErr);
        window.print();
      }
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadOfferPNG = async () => {
    const offerElement = document.getElementById('offer-letter-preview');
    if (!offerElement || !data?.student) return;

    try {
      setDownloading('png');
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(offerElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const sanitizedName = (data.student.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Altruisty_Offer_Letter_${sanitizedName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Failed to download offer letter as PNG', err);
      window.print();
    } finally {
      setDownloading(null);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/student/dashboard');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load dashboard');
      }
      setData(json);

      // Generate QR code if certificate exists
      if (json.certificate?.verification_url) {
        const qrUrl = await QRCode.toDataURL(json.certificate.verification_url, {
          width: 140,
          margin: 1,
          color: { dark: '#1b449c', light: '#ffffff' },
        });
        setQrCodeDataUrl(qrUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCopyReferral = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handlePayBalance = async () => {
    setPayingBalance(true);
    setPayError(null);

    try {
      const intentRes = await fetch('/api/student/pay-balance-intent', {
        method: 'POST',
      });
      const intentData = await intentRes.json();

      if (!intentRes.ok || !intentData.success) {
        throw new Error(intentData.error || 'Failed to initialize balance payment');
      }

      // If balance was completely waived by referral discounts
      if (intentData.zeroBalanceSettled) {
        await fetchDashboardData();
        setActiveTab('certificate');
        return;
      }

      // Open Razorpay Modal
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      const options = {
        key: intentData.keyId,
        amount: intentData.amount * 100, // paise
        currency: intentData.currency || 'INR',
        name: 'Altruisty Innovation Pvt Ltd',
        description: `Remaining Balance Fee - ${data.student.track_name}`,
        image: '/logo.png',
        order_id: intentData.orderId,
        prefill: {
          name: data.student.name,
          email: data.student.email,
          contact: data.student.phone,
        },
        theme: {
          color: '#1b449c',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/student/verify-balance-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: intentData.amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Balance verification failed');
            }

            await fetchDashboardData();
            setActiveTab('certificate');
          } catch (err: any) {
            setPayError(err.message || 'Payment verification failed');
          } finally {
            setPayingBalance(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPayingBalance(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setPayError(err.message || 'Error initiating payment');
      setPayingBalance(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Dashboard Unavailable</h2>
          <p className="text-sm text-slate-600">{errorMsg}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { student, referrals, classes, certificate } = data;
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referrals.code}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Open student navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="relative h-10 w-36 sm:w-40">
              <Image src="/logo.png" alt="Altruisty" fill className="object-contain object-left" />
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{student.name}</p>
              <p className="text-xs text-slate-500">{student.email}</p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between p-6 animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="relative h-8 w-32">
                  <Image src="/logo.png" alt="Altruisty" fill className="object-contain object-left" />
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Student Profile Overview */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-900">{student.name}</p>
                <p className="text-[11px] text-blue-700 truncate">{student.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-blue-200/60 text-blue-800 capitalize">
                  {student.track_name} ({student.mode})
                </span>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('classes');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'classes'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>Classes & Schedule</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'classes' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {classes.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5" />
                    <span>Referral Rewards</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'profile' ? 'bg-white/20' : 'bg-amber-100 text-amber-800'}`}>
                    {referrals.count}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('offer');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'offer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    <span>Offer Letter</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Official
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('certificate');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'certificate'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    <span>Certificate</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${student.balance_paid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {student.balance_paid ? 'Issued' : 'Locked'}
                  </span>
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Student Profile Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-xs">
                <span>{student.category.toUpperCase()} INTERNSHIP</span>
                <span>•</span>
                <span className="capitalize">{student.mode} Mode</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{student.track_name}</h1>
              <p className="text-xs sm:text-sm text-sky-100">
                Batch: <strong>{student.batch_name || 'Assignment in progress'}</strong> • Mentor: <strong>{student.mentor_name}</strong>
              </p>
            </div>

            {/* Quick Balance Status Widget */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-right shrink-0">
              <span className="text-xs text-sky-200 font-medium">Certificate Balance Fee:</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {student.balance_paid ? (
                  <span className="text-emerald-300 flex items-center gap-1.5 justify-end">
                    <Check className="w-6 h-6" /> Settled
                  </span>
                ) : (
                  <span>₹{referrals.netBalancePayable.toLocaleString('en-IN')}</span>
                )}
              </div>
              {!student.balance_paid && (
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="mt-2 text-xs font-bold text-amber-300 hover:text-amber-200 underline block ml-auto"
                >
                  Pay Balance to Unlock Certificate →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'classes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Classes & Schedule</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
              {classes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Referral Rewards</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-400 text-amber-950 font-black">
              {referrals.count} Referred
            </span>
          </button>

          <button
            onClick={() => setActiveTab('offer')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'offer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Offer Letter</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">
              Official
            </span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'certificate'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Completion Certificate</span>
            {student.balance_paid ? (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">
                Issued
              </span>
            ) : (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-700">
                Locked
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CLASSES & SCHEDULE */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {student.mode === 'online' ? (
                      <>
                        <Video className="w-5 h-5 text-blue-600" />
                        <span>Online Live Sessions (Google Meet)</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5 text-amber-600" />
                        <span>Offline In-Person Office Sessions</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {student.mode === 'online'
                      ? 'Click the direct Google Meet link at scheduled class timings.'
                      : 'Report to Altruisty Innovation Office at scheduled timings.'}
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                  Batch: {student.batch_name || 'Unassigned (Staff will assign shortly)'}
                </div>
              </div>

              {classes.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700">No scheduled sessions yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Your mentor will schedule upcoming sessions on the calendar. Whenever a class is scheduled, you will also receive an automated email!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                            {new Date(cls.class_date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {cls.start_time} - {cls.end_time}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{cls.class_title}</h4>
                        <p className="text-xs text-slate-500">
                          Mentor: <strong>{cls.staff_name || 'Course Instructor'}</strong>
                        </p>

                        {/* Venue details for offline */}
                        {cls.mode === 'offline' && (
                          <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                            <strong>Office Timings & Venue:</strong><br />
                            <span>{cls.venue_instructions || 'Offline Training Center (Please check with your mentor)'}</span>
                          </div>
                        )}
                      </div>

                      {/* Online Join Button */}
                      {cls.mode === 'online' && cls.gmeet_link && (
                        <div className="shrink-0">
                          <a
                            href={cls.gmeet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                          >
                            <Video className="w-4 h-4" />
                            <span>Join Google Meet</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & REFERRALS */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Referral Hub & Fee Deductions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Referral Code Box */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-500" />
                      Your Unique Referral Code
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Earn ₹25 deducted from your certificate balance for every friend who joins!
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    ₹25 / Friend
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    Your Referral Code:
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-wider bg-white px-5 py-2.5 rounded-xl border border-amber-300">
                      {referrals.code}
                    </div>
                    <button
                      onClick={() => handleCopyReferral(referrals.code, false)}
                      className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopyReferral(referralLink, true)}
                      className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Full Referral Link'}</span>
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hey! Join an industry internship at Altruisty Innovation Pvt Ltd. Use my referral code ${referrals.code} to get ₹25 off your certificate fee! Register here: ${referralLink}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Balance Fee Breakdown Table */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Certificate Balance Amount Calculation
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Internship Program Fee:</span>
                      <strong className="text-slate-900">₹{student.total_fee.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>50% Initial Fee Paid at Registration:</span>
                      <strong className="text-emerald-600">-₹{student.initial_amount_paid.toLocaleString('en-IN')} (Paid)</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-semibold text-slate-800">
                      <span>Base Remaining Balance Fee:</span>
                      <span>₹{student.balance_fee.toLocaleString('en-IN')}</span>
                    </div>

                    {referrals.refereeDiscountApplied > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Referee Welcome Discount (Enrolled with referral code):</span>
                        <span>-₹{referrals.refereeDiscountApplied}</span>
                      </div>
                    )}

                    {referrals.discountEarned > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Referral Bonus ({referrals.count} confirmed friends × ₹25):</span>
                        <span>-₹{referrals.discountEarned}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                      <span className="font-bold text-slate-900">Net Balance Payable for Certificate:</span>
                      <span className="text-lg font-black text-blue-700">
                        {student.balance_paid ? (
                          <span className="text-emerald-600">Paid (₹{student.balance_amount_paid})</span>
                        ) : (
                          `₹${referrals.netBalancePayable.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* List of Referred Friends */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Referred Friends ({referrals.list.length})
                  </h3>
                  {referrals.list.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      No friends have registered with your code yet. Share your code to earn ₹25 discounts!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {referrals.list.map((ref: any) => (
                        <div
                          key={ref.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{ref.name}</p>
                            <p className="text-slate-400 text-[11px]">
                              Enrolled on {new Date(ref.date).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                            +₹{ref.discount} Deducted
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Student Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Personal Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Name</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{student.name}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Email</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{student.email}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Phone</span>
                  <p className="font-semibold text-slate-800 mt-0.5">+91 {student.phone}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Date of Birth</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : 'N/A'}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Address</span>
                  <p className="text-slate-700 mt-0.5">{student.address}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Enrolled Domain</span>
                  <p className="font-bold text-blue-700 mt-0.5">{student.track_name}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Duration & Mode</span>
                  <p className="text-slate-700 mt-0.5 capitalize">{student.duration} • {student.mode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFER LETTER */}
        {activeTab === 'offer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Official Internship Offer Letter
                </h2>
                <p className="text-xs text-slate-500">
                  Registration ID: <strong>{`125${new Date(student.created_at || Date.now()).getFullYear()}${String(student.id).padStart(4, '0')}`}</strong> • Domain: <strong>{student.track_name}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadOfferPDF}
                  disabled={downloading !== null}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-75"
                >
                  {downloading === 'pdf' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Offer Letter (PDF)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadOfferPNG}
                  disabled={downloading !== null}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-75"
                  title="Download image format"
                >
                  {downloading === 'png' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Image (PNG)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>

            {/* Offer Letter Container with Proportional Scale */}
            <div
              ref={offerContainerRef}
              className="w-full flex justify-center items-start overflow-hidden py-2"
              style={{ height: `${1123 * offerScale}px` }}
            >
              <div
                style={{
                  transform: `scale(${offerScale})`,
                  transformOrigin: 'top center',
                  width: '794px',
                  height: '1123px',
                  flexShrink: 0,
                }}
              >
                {(() => {
                  const regDateObj = student?.created_at ? new Date(student.created_at) : new Date();
                  const r_dd = String(regDateObj.getDate()).padStart(2, '0');
                  const r_mm = String(regDateObj.getMonth() + 1).padStart(2, '0');
                  const r_yyyy = regDateObj.getFullYear();
                  const formattedOfferDate = `${r_dd}-${r_mm}-${r_yyyy}`;
                  const studentRegId = `125${r_yyyy}${String(student.id).padStart(4, '0')}`;

                  return (
                    <OfferLetterPreview
                      fields={{
                        candidateName: student.name,
                        domain: student.track_name,
                        startDate: formattedOfferDate,
                        duration: student.duration || '30 Days',
                        date: formattedOfferDate,
                        regId: studentRegId,
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            {!student.balance_paid ? (
              /* LOCKED STATE: Needs Balance Payment */
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Certificate Locked</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    To receive your official verifiable certificate of completion, please settle your remaining balance fee.
                  </p>
                </div>

                {payError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Remaining Balance:</span>
                    <strong className="text-slate-800">₹{student.balance_fee}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Referral Deductions Applied:</span>
                    <strong>-₹{referrals.totalDeductions}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-900">Amount to Pay Now:</span>
                    <span className="text-2xl font-black text-blue-700">₹{referrals.netBalancePayable}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayBalance}
                  disabled={payingBalance}
                  className="w-full max-w-md mx-auto py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 hover:from-blue-800 hover:to-sky-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {payingBalance ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Remaining Balance (₹{referrals.netBalancePayable})</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400">
                  Tip: Invite more friends using your code <strong>{referrals.code}</strong> to reduce this balance fee further!
                </p>
              </div>
            ) : certificate ? (
              /* UNLOCKED & ISSUED STATE: Official Verifiable Certificate */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-6 h-6 text-emerald-600" />
                      Official Certificate of Completion
                    </h2>
                    <p className="text-xs text-slate-500">
                      Credential ID: <strong>{certificate.certificate_id}</strong> • Issue Date:{' '}
                      <strong>{new Date(certificate.issue_date).toLocaleDateString('en-IN')}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadCertPDF}
                      disabled={downloading !== null}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-75"
                    >
                      {downloading === 'pdf' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download Certificate (PDF)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadCertPNG}
                      disabled={downloading !== null}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-75"
                      title="Download image format"
                    >
                      {downloading === 'png' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileDown className="w-4 h-4 text-slate-500" />
                      )}
                      <span>Image (PNG)</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      title="Print Certificate"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Print</span>
                    </button>

                    <Link
                      href={`/verify-certificate/${certificate.certificate_id}`}
                      target="_blank"
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Verification Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Certificate Container with Proportional Scale */}
                <div
                  ref={certContainerRef}
                  className="w-full flex justify-center items-start overflow-hidden py-2"
                  style={{ height: `${1123 * certScale}px` }}
                >
                  <div
                    style={{
                      transform: `scale(${certScale})`,
                      transformOrigin: 'top center',
                      width: '794px',
                      height: '1123px',
                      flexShrink: 0,
                    }}
                  >
                    {(() => {
                      const certDateObj = certificate ? new Date(certificate.issue_date) : new Date();
                      const c_dd = String(certDateObj.getDate()).padStart(2, '0');
                      const c_mm = String(certDateObj.getMonth() + 1).padStart(2, '0');
                      const c_yy = String(certDateObj.getFullYear()).slice(-2);
                      const c_yyyy = certDateObj.getFullYear();
                      const formattedCertDate = `${c_dd}-${c_mm}-${c_yy}`;

                      const certStartDateObj = new Date(certDateObj);
                      certStartDateObj.setDate(certStartDateObj.getDate() - 30);
                      const cs_dd = String(certStartDateObj.getDate()).padStart(2, '0');
                      const cs_mm = String(certStartDateObj.getMonth() + 1).padStart(2, '0');
                      const cs_yyyy = certStartDateObj.getFullYear();
                      const formattedCertStartDate = `${cs_dd}-${cs_mm}-${cs_yyyy}`;
                      const formattedCertEndDate = `${c_dd}-${c_mm}-${c_yyyy}`;

                      const certRegNo = certificate?.certificate_id ? certificate.certificate_id.split('-').pop() || '0001' : '0001';
                      const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-certificate/${certificate.certificate_id}`;

                      return (
                        <CompletionCertificatePreview
                          fields={{
                            candidateName: student.name,
                            domain: student.track_name,
                            startDate: formattedCertStartDate,
                            endDate: formattedCertEndDate,
                            duration: student.duration || '30 Days',
                            date: formattedCertDate,
                            regno: certRegNo,
                            certificateId: certificate.certificate_id,
                            qrCodeDataUrl: qrCodeDataUrl || undefined,
                            verificationUrl: verifyUrl,
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              /* Awaiting Admin Approval */
              <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-4">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Balance Payment Received!</h3>
                <p className="text-xs text-slate-600">
                  Your final payment has been logged. Your certificate is generating and will appear here momentarily.
                </p>
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Refresh Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
