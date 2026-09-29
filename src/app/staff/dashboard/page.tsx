'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Users,
  Calendar,
  Video,
  Building2,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Mail,
  UserCheck,
  Send,
  Loader2,
  Search,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'batches' | 'students'>('schedule');

  // Mobile Navigation Menu Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // New Batch Form State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    batch_name: '',
    category: '',
    mode: '',
    start_date: '',
    end_date: '',
  });

  // Assign Students State
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [targetBatchId, setTargetBatchId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Class Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    batch_id: '',
    class_title: '',
    class_date: '',
    start_time: '',
    end_time: '',
    mode: 'online',
    gmeet_link: '',
    venue_instructions: '',
  });
  const [scheduling, setScheduling] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashRes, stuRes, clsRes] = await Promise.all([
        fetch('/api/staff/dashboard'),
        fetch('/api/staff/students'),
        fetch('/api/staff/classes'),
      ]);

      if (dashRes.status === 401) {
        router.push('/staff/login');
        return;
      }

      const dashJson = await dashRes.json();
      const stuJson = await stuRes.json();
      const clsJson = await clsRes.json();

      if (dashJson.success) setData(dashJson);
      if (stuJson.success) setStudents(stuJson.students);
      if (clsJson.success) setClasses(clsJson.classes);
    } catch (err: any) {
      console.error('Error loading staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/staff/login');
  };

  // Create Batch Submit
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm),
      });

      const text = await res.text();
      let resData: any;
      try {
        resData = JSON.parse(text);
      } catch {
        throw new Error('Server returned an invalid response');
      }

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to create batch');
      }

      setShowBatchModal(false);
      setNotification({ type: 'success', message: 'Batch created successfully!' });
      setBatchForm({ batch_name: '', category: '', mode: '', start_date: '', end_date: '' });
      await loadAllData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  // Assign Students Submit (handles bulk or single student)
  const handleAssignStudents = async (studentIdToAssign?: number, specificBatchId?: string) => {
    const batchIdToUse = specificBatchId || targetBatchId;
    const studentIdsToUse = studentIdToAssign ? [studentIdToAssign] : selectedStudentIds;

    if (!batchIdToUse) {
      setNotification({ type: 'error', message: 'Please select a target batch.' });
      return;
    }

    if (studentIdsToUse.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one student.' });
      return;
    }

    setAssigning(true);
    setNotification(null);

    try {
      const res = await fetch('/api/staff/assign-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: parseInt(batchIdToUse, 10),
          student_ids: studentIdsToUse,
        }),
      });

      const text = await res.text();
      let resData: any;
      try {
        resData = JSON.parse(text);
      } catch {
        throw new Error('Server returned an unexpected response. Please refresh.');
      }

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to assign students');
      }

      setSelectedStudentIds([]);
      setTargetBatchId('');
      setNotification({ type: 'success', message: resData.message });
      await loadAllData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Assignment failed' });
    } finally {
      setAssigning(false);
    }
  };

  // Schedule Session Submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);
    setNotification(null);

    try {
      const res = await fetch('/api/staff/schedule-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      });

      const text = await res.text();
      let resData: any = {};
      try {
        resData = JSON.parse(text);
      } catch {
        throw new Error(text || 'Server returned an invalid response.');
      }

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to schedule class');
      }

      setShowScheduleModal(false);
      setNotification({
        type: 'success',
        message: resData.message || 'Session scheduled and automated emails sent successfully!',
      });
      setScheduleForm({
        batch_id: '',
        class_title: '',
        class_date: '',
        start_time: '',
        end_time: '',
        mode: 'online',
        gmeet_link: '',
        venue_instructions: '',
      });
      await loadAllData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setScheduling(false);
    }
  };

  const toggleStudentSelection = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  const { staff, batches } = data || { staff: {}, batches: [] };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Open staff navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="relative h-10 w-36 sm:w-40">
              <Image src="/logo.png" alt="Altruisty" fill className="object-contain object-left" />
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              Staff & Mentor Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{staff.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{staff.specialization || 'Technical Mentor'}</p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center border border-sky-200">
              {staff.name ? staff.name.charAt(0).toUpperCase() : 'M'}
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
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

              {/* Staff Mini Profile */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100">
                <p className="text-xs font-bold text-sky-900">{staff.name}</p>
                <p className="text-[11px] text-sky-700">{staff.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-sky-200/60 text-sky-800">
                  {staff.specialization || 'Technical Mentor'}
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>Class Sessions & Calendar</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'schedule' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {classes.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('batches');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'batches'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span>Batch Management</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'batches' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    {batches.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('students');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'students'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5" />
                    <span>Assign Students</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'students' ? 'bg-white/20' : 'bg-sky-100 text-sky-800'}`}>
                    {students.length}
                  </span>
                </button>
              </nav>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowScheduleModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>Schedule Class Session</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowBatchModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                  <span>Create New Cohort Batch</span>
                </button>
              </div>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Instructor Console</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Mentor Scheduling & Batch Manager</h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
              Assign students to batches, plan live Google Meet sessions, or dispatch Chennai office reporting timings with 1-click email notifications.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowBatchModal(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Batch</span>
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-sky-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Schedule Class</span>
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-xs font-bold underline cursor-pointer ml-3">
              Dismiss
            </button>
          </div>
        )}

        {/* Desktop Tab Controls */}
        <div className="hidden md:flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Class Sessions & Calendar</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">{classes.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'batches'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Batch Management</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">{batches.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign Students</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-sky-100 text-sky-800">
              {students.length}
            </span>
          </button>
        </div>

        {/* TAB 1: SESSIONS & CALENDAR */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Scheduled Sessions & Email Log</h2>
                <p className="text-xs text-slate-500">
                  Every scheduled class automatically emails all batch students with GMeet links or office timings.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Session
              </button>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No classes scheduled yet. Click "Add Session" to schedule a class and send automated student emails.
              </div>
            ) : (
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800 uppercase">
                          {cls.batch_name}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(cls.class_date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-xs text-slate-500">
                          {cls.start_time} - {cls.end_time}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{cls.class_title}</h4>

                      {cls.mode === 'online' ? (
                        <p className="text-xs text-blue-600 flex items-center gap-1.5 break-all">
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Google Meet Link: </span>
                          <a href={cls.gmeet_link} target="_blank" className="underline font-bold">
                            {cls.gmeet_link}
                          </a>
                        </p>
                      ) : (
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Offline Venue: </span>
                          <span>{cls.venue_instructions || 'Offline Training Center'}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 self-start md:self-center">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>Email Dispatched</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BATCH MANAGEMENT */}
        {activeTab === 'batches' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Current Batches</h2>
                <p className="text-xs text-slate-500">Overview of all active and upcoming internship cohorts</p>
              </div>
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Cohort
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {batches.map((b: any) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all space-y-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 uppercase">
                      {b.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 capitalize">{b.mode}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{b.batch_name}</h3>
                  <p className="text-xs text-slate-500">Track: {b.track_name || 'General Batch'}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {new Date(b.start_date).toLocaleDateString('en-IN')} -{' '}
                      {new Date(b.end_date).toLocaleDateString('en-IN')}
                    </span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {b.student_count || 0} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGN STUDENTS */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Student Assignment Hub</h2>
                <p className="text-xs text-slate-500">
                  Select a batch and assign students directly using bulk selection or individual assign buttons.
                </p>
              </div>

              {/* Bulk Assignment Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-600"
                >
                  <option value="">Select Target Batch</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_name} ({b.mode})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleAssignStudents()}
                  disabled={assigning || selectedStudentIds.length === 0 || !targetBatchId}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {assigning ? (
                    'Assigning...'
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Assign Selected ({selectedStudentIds.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Students List: Responsive Cards on Mobile & Table on Desktop */}
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase">
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.length === students.length && students.length > 0}
                        onChange={selectAllStudents}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Track / Category</th>
                    <th className="p-3">Mode & Duration</th>
                    <th className="p-3">Current Batch</th>
                    <th className="p-3 text-right">Quick Assign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => toggleStudentSelection(s.id)}
                          className="rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-bold text-slate-800">{s.name}</td>
                      <td className="p-3 text-slate-600">
                        {s.email}<br />
                        <span className="text-[11px] text-slate-400">+91 {s.phone}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-700">{s.track_name}</span>
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">{s.category}</span>
                      </td>
                      <td className="p-3 capitalize text-slate-600">{s.mode} • {s.duration}</td>
                      <td className="p-3">
                        {s.batch_name ? (
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {s.batch_name}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold text-[11px]">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {batches.length > 0 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignStudents(s.id, e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="px-2 py-1 text-[11px] rounded-lg border border-slate-300 bg-white font-medium"
                          >
                            <option value="" disabled>Assign to...</option>
                            {batches.map((b: any) => (
                              <option key={b.id} value={b.id}>
                                {b.batch_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(s.id)}
                        onChange={() => toggleStudentSelection(s.id)}
                        className="rounded w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>

                    {s.batch_name ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold shrink-0">
                        {s.batch_name}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold shrink-0">
                        Unassigned
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5 pl-6 border-t border-slate-100 pt-2">
                    <p>Track: <strong className="text-blue-700">{s.track_name}</strong></p>
                    <p>Mode: <span className="capitalize">{s.mode} • {s.duration}</span></p>
                    <p>Phone: +91 {s.phone}</p>
                  </div>

                  {batches.length > 0 && (
                    <div className="pl-6 pt-1">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignStudents(s.id, e.target.value);
                          }
                        }}
                        defaultValue=""
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        <option value="" disabled>Quick Assign to Batch...</option>
                        {batches.map((b: any) => (
                          <option key={b.id} value={b.id}>
                            Assign to {b.batch_name} ({b.mode})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: CREATE NEW BATCH */}
        {showBatchModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Create New Internship Batch</h3>
                <button
                  onClick={() => setShowBatchModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={batchForm.batch_name}
                    onChange={(e) => setBatchForm({ ...batchForm, batch_name: e.target.value })}
                    placeholder="e.g. FullStack-Alpha-2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={batchForm.category}
                      onChange={(e) => setBatchForm({ ...batchForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="">Select Category</option>
                      <option value="project">Project Internship</option>
                      <option value="training">Training Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mode *
                    </label>
                    <select
                      required
                      value={batchForm.mode}
                      onChange={(e) => setBatchForm({ ...batchForm, mode: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    >
                      <option value="">Select Mode</option>
                      <option value="online">Online (Google Meet)</option>
                      <option value="offline">Offline (In-Person)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={batchForm.start_date}
                      onChange={(e) => setBatchForm({ ...batchForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={batchForm.end_date}
                      onChange={(e) => setBatchForm({ ...batchForm, end_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer"
                  >
                    Create Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SCHEDULE SESSION */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Schedule Class Session</h3>
                  <p className="text-xs text-sky-600 font-semibold">
                    Automated email with links/timings will be sent to all batch students!
                  </p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Select Target Batch *
                  </label>
                  <select
                    required
                    value={scheduleForm.batch_id}
                    onChange={(e) => {
                      const selected = batches.find((b: any) => b.id.toString() === e.target.value);
                      setScheduleForm({
                        ...scheduleForm,
                        batch_id: e.target.value,
                        mode: selected ? selected.mode : 'online',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  >
                    <option value="">Choose a Batch</option>
                    {batches.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_name} ({b.mode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Session Topic / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.class_title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, class_title: e.target.value })}
                    placeholder="e.g. Live Coding: Database Schema & Authentication"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.class_date}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, class_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.start_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.end_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {scheduleForm.mode === 'online' ? (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                    <label className="block text-xs font-bold text-blue-900 uppercase">
                      Google Meet Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={scheduleForm.gmeet_link}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, gmeet_link: e.target.value })}
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-blue-300 bg-white"
                    />
                    <p className="text-[11px] text-blue-700 font-medium">
                      ✓ This link will be directly emailed to all students enrolled in this batch!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                    <label className="block text-xs font-bold text-amber-900 uppercase">
                      Office Timings & Venue Instructions *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={scheduleForm.venue_instructions}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, venue_instructions: e.target.value })}
                      placeholder="e.g. Please bring your laptop and report 10 minutes before scheduled start time."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white"
                    />
                    <p className="text-[11px] text-amber-700 font-medium">
                      ✓ These office reporting timings will be emailed directly to every offline student!
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {scheduling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Emails...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Schedule & Send Emails</span>
                      </>
                    )}
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
