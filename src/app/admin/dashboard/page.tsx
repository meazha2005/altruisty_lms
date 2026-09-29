'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  CreditCard,
  Tag,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Mail,
  Calendar,
  Lock,
  Loader2,
  ExternalLink,
  Send,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'staff' | 'coupons' | 'payments' | 'certificates'
  >('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [certificatesData, setCertificatesData] = useState<{
    certificates: any[];
    eligibleStudents: any[];
  }>({ certificates: [], eligibleStudents: [] });

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterCategory, setStudentFilterCategory] = useState('');

  // Selected Student View Modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Add Staff Modal
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    password: '',
  });

  // Add Coupon Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: '',
    discount_value: '',
    min_amount: '',
    max_uses: '',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes, staffRes, couponsRes, paymentsRes, certsRes] =
        await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/students'),
          fetch('/api/admin/staff'),
          fetch('/api/admin/coupons'),
          fetch('/api/admin/payments'),
          fetch('/api/admin/certificates'),
        ]);

      if (statsRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      const [statsJson, studentsJson, staffJson, couponsJson, paymentsJson, certsJson] =
        await Promise.all([
          statsRes.json(),
          studentsRes.json(),
          staffRes.json(),
          couponsRes.json(),
          paymentsRes.json(),
          certsRes.json(),
        ]);

      if (statsJson.success) setStats(statsJson);
      if (studentsJson.success) setStudents(studentsJson.students);
      if (staffJson.success) setStaffList(staffJson.staff);
      if (couponsJson.success) setCoupons(couponsJson.coupons);
      if (paymentsJson.success) setPayments(paymentsJson.payments);
      if (certsJson.success) {
        setCertificatesData({
          certificates: certsJson.certificates,
          eligibleStudents: certsJson.eligibleStudents,
        });
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Add Staff Submit
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add staff');
      }
      setShowAddStaffModal(false);
      setStaffForm({ name: '', email: '', phone: '', specialization: '', password: '' });
      setNotification({ type: 'success', message: 'Staff member added successfully!' });
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  // Add Coupon Submit
  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponForm.code,
          discount_type: couponForm.discount_type || 'fixed',
          discount_value: parseFloat(couponForm.discount_value),
          min_amount: couponForm.min_amount ? parseFloat(couponForm.min_amount) : 0,
          max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses, 10) : 100,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create coupon');
      }
      setShowAddCouponModal(false);
      setCouponForm({ code: '', discount_type: '', discount_value: '', min_amount: '', max_uses: '' });
      setNotification({ type: 'success', message: 'Coupon created successfully!' });
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  // Issue Certificate Submit
  const handleIssueCertificate = async (studentId: number) => {
    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, grade: 'A+' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to issue certificate');
      }
      setNotification({ type: 'success', message: data.message });
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch) ||
      (s.referral_code && s.referral_code.toLowerCase().includes(studentSearch.toLowerCase()));

    const matchesCategory = studentFilterCategory ? s.category === studentFilterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const overview = stats?.stats || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Open admin navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="relative h-10 w-36 sm:w-40">
              <Image src="/logo.png" alt="Altruisty" fill className="object-contain object-left" />
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 hidden sm:inline-block">
              Super Admin Mode
            </span>

            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
              AD
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

              {/* Admin Badge */}
              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-900">Administrator Console</p>
                <p className="text-[11px] text-indigo-600">Full system & database access</p>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Overview & Stats</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('students');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'students'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Management</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'students' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {students.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('staff');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'staff'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Staff Management</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'staff' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {staffList.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('coupons');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'coupons'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4" />
                    <span>Coupon Codes</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'coupons' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {coupons.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('payments');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'payments'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Audit & Payments</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'payments' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {payments.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('certificates');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'certificates'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4" />
                    <span>Certificates</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'certificates' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {certificatesData.certificates.length}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Desktop Tab Selector */}
        <div className="hidden md:flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Management ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Management ({staffList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupon Codes ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'payments'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Audit Ledger & Payments ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificatesData.certificates.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue Collected</span>
                <div className="text-2xl font-black text-slate-900">
                  ₹{Number(overview.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Initial 50%: ₹{Number(overview.initialHalfRevenue || 0).toLocaleString('en-IN')}</span>
                  <span>Balance: ₹{Number(overview.balanceRevenue || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Enrolled Students</span>
                <div className="text-2xl font-black text-blue-700">{overview.totalStudents || 0}</div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Verified: {overview.verifiedStudents || 0}</span>
                  <span>Fully Paid: {overview.fullyPaidStudents || 0}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Batches & Staff</span>
                <div className="text-2xl font-black text-sky-700">{overview.totalBatches || 0} Batches</div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Active Batches: {overview.activeBatches || 0}</span>
                  <span>Instructors: {overview.totalStaff || 0}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Certificates Issued</span>
                <div className="text-2xl font-black text-emerald-600">
                  {overview.totalCertificates || 0}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                  Verifiable via QR & Public URLs
                </div>
              </div>
            </div>

            {/* Recent Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Registrations */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Registrations</h3>
                  <button onClick={() => setActiveTab('students')} className="text-xs font-bold text-indigo-600">
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {(stats?.recentStudents || []).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-slate-500">{s.track_name} ({s.category})</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-700">₹{s.initial_amount_paid} paid</span>
                        <p className="text-[10px] text-slate-400">{new Date(s.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Razorpay Payments</h3>
                  <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-indigo-600">
                    Audit All →
                  </button>
                </div>
                <div className="space-y-3">
                  {(stats?.recentPayments || []).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{p.student_name}</p>
                        <p className="text-slate-400 font-mono text-[10px]">{p.razorpay_payment_id}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600">+₹{p.amount}</span>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          {p.payment_type === 'initial_half' ? 'Initial 50%' : 'Final Balance'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT MANAGEMENT */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Student Directory & History</h2>
                <p className="text-xs text-slate-500">
                  Complete view of enrolled students, referral metrics, and payment records
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name, email, phone, code..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-64"
                  />
                </div>

                <select
                  value={studentFilterCategory}
                  onChange={(e) => setStudentFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="project">Project</option>
                  <option value="training">Training</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                    <th className="p-3">Student</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Track & Mode</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3">Referral Code</th>
                    <th className="p-3">Referred Friends</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <strong className="font-bold text-slate-900 block">{s.name}</strong>
                        <span className="text-[10px] text-slate-400">ID #{s.id}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {s.email}<br />
                        <span className="text-[11px] text-slate-400">+91 {s.phone}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-700">{s.track_name}</span>
                        <span className="block text-[10px] text-slate-500 capitalize">{s.category} • {s.mode} ({s.duration})</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800">Paid: ₹{s.initial_amount_paid}</span>
                        {s.balance_paid ? (
                          <span className="block text-emerald-600 font-bold text-[11px]">✓ Balance Settled</span>
                        ) : (
                          <span className="block text-amber-600 font-medium text-[11px]">Due: ₹{s.balance_fee}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-800">
                        {s.referral_code}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-black">
                          {s.referral_count || 0} Friends
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Staff & Instructor Management</h2>
                <p className="text-xs text-slate-500">Create instructor accounts and assign technical domains</p>
              </div>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Add New Staff
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((st) => (
                <div key={st.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                      {st.status}
                    </span>
                    <span className="text-xs text-slate-400">ID #{st.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
                  <p className="text-xs font-semibold text-blue-700">{st.specialization}</p>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                    <p>Email: {st.email}</p>
                    <p>Phone: +91 {st.phone}</p>
                    <p className="font-semibold text-slate-700">Cohorts Mentored: {st.batch_count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COUPON MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Discount Coupon Codes</h2>
                <p className="text-xs text-slate-500">
                  Manage promotional coupons (applicable exclusively to Project Internships)
                </p>
              </div>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Type</th>
                    <th className="p-3">Discount Value</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Redeemed / Max</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-mono font-bold text-slate-900 text-sm">{c.code}</td>
                      <td className="p-3 capitalize text-slate-600">{c.discount_type}</td>
                      <td className="p-3 font-bold text-emerald-600">
                        {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      </td>
                      <td className="p-3 uppercase font-semibold text-blue-700">{c.applicable_category}</td>
                      <td className="p-3 text-slate-600">{c.used_count} / {c.max_uses}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENTS AUDIT */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Payment Audit Trail & Razorpay Logs</h2>
              <p className="text-xs text-slate-500">Every Razorpay transaction with order ID, payment ID, and timestamp</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                    <th className="p-3">Student</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Razorpay Payment ID</th>
                    <th className="p-3">Razorpay Order ID</th>
                    <th className="p-3">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-sans font-bold text-slate-900 text-xs">{p.student_name}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.payment_type === 'initial_half' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'}`}>
                          {p.payment_type === 'initial_half' ? 'INITIAL 50%' : 'BALANCE FINAL'}
                        </span>
                      </td>
                      <td className="p-3 font-sans font-black text-slate-900 text-xs">₹{p.amount}</td>
                      <td className="p-3 text-slate-600">{p.razorpay_payment_id}</td>
                      <td className="p-3 text-slate-500">{p.razorpay_order_id}</td>
                      <td className="p-3 font-sans text-slate-500">{new Date(p.created_at).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATES & ISSUANCE */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {/* Eligible for Certificate Section */}
            {certificatesData.eligibleStudents.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Students Awaiting Certificate Issuance ({certificatesData.eligibleStudents.length})</span>
                </div>
                <p className="text-xs text-amber-800">
                  These students have settled their final balance payment and are eligible for certificate issuance and automatic email notification.
                </p>

                <div className="space-y-3">
                  {certificatesData.eligibleStudents.map((st: any) => (
                    <div key={st.id} className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div>
                        <strong className="text-slate-900 font-bold text-sm">{st.name}</strong>
                        <p className="text-slate-500">{st.track_name} ({st.duration}) • {st.email}</p>
                      </div>
                      <button
                        onClick={() => handleIssueCertificate(st.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Issue Certificate & Email</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issued Certificates Directory */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Issued Certificates</h3>
                <p className="text-xs text-slate-500">Publicly verifiable credentials with permanent verification URLs</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                      <th className="p-3">Credential ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Domain</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificatesData.certificates.map((c: any) => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono font-bold text-indigo-700">{c.certificate_id}</td>
                        <td className="p-3 font-bold text-slate-900">{c.student_name}</td>
                        <td className="p-3 text-slate-600">{c.track_name}</td>
                        <td className="p-3 text-slate-500">{new Date(c.issue_date).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 font-bold text-emerald-600">{c.grade}</td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/verify-certificate/${c.certificate_id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: VIEW COMPLETE STUDENT DETAILS */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">Student Profile & Course History</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedStudent.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                  <p className="font-semibold text-slate-800 mt-0.5">+91 {selectedStudent.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Date of Birth</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString('en-IN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedStudent.address}</p>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Enrolled Track & Mode</span>
                  <p className="font-bold text-blue-700 mt-0.5">
                    {selectedStudent.track_name} ({selectedStudent.category} • {selectedStudent.mode} • {selectedStudent.duration})
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Total Program Fee</span>
                  <p className="font-bold text-slate-900 mt-0.5">₹{selectedStudent.total_fee}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Initial 50% Paid</span>
                  <p className="font-bold text-emerald-600 mt-0.5">₹{selectedStudent.initial_amount_paid}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Remaining Balance Fee</span>
                  <p className="font-bold text-amber-600 mt-0.5">₹{selectedStudent.balance_fee}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Balance Paid Status</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedStudent.balance_paid ? '✓ Fully Settled' : 'Pending Completion'}
                  </p>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Unique Referral Code</span>
                  <p className="font-mono font-bold text-blue-800 text-sm mt-0.5">
                    {selectedStudent.referral_code}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Referred {selectedStudent.referral_count || 0} friends (₹{(selectedStudent.referral_count || 0) * 25} discount earned)
                  </p>
                  {selectedStudent.referred_by_code && (
                    <p className="text-[11px] text-emerald-600 mt-1">
                      Joined with referral code: {selectedStudent.referred_by_code} (₹25 referee deduction applied)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD STAFF */}
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Add New Staff / Mentor</h3>
                <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 text-lg font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={staffForm.specialization}
                    onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                    placeholder="e.g. AI & Full Stack"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl">
                    Create Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD COUPON */}
        {showAddCouponModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Create Promotional Coupon</h3>
                <button onClick={() => setShowAddCouponModal(false)} className="text-slate-400 text-lg font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCouponSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER300"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                    <select
                      required
                      value={couponForm.discount_type}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="">Select Type</option>
                      <option value="fixed">Fixed (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Value</label>
                    <input
                      type="number"
                      required
                      value={couponForm.discount_value}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                      placeholder="e.g. 200 or 10"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddCouponModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl">
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
