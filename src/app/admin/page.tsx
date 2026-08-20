'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Course } from '@/types/course';
import { AdminHeader } from '@/components/AdminHeader';
import { formatTimeRemaining, formatPrice, generateUdemyAffiliateUrl } from '@/utils/affiliate';
import { getPublicSiteOrigin } from '@/utils/offers';
import { ShieldCheck, KeyRound, Plus, RefreshCw, AlertTriangle, Check, Copy, Trash2, Zap, Star, Search, Flame, Send, MessageCircle, Lock, Sparkles, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPage() {
  // Auth state
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'pipeline'>('manage');
  const [statusFilter, setStatusFilter] = useState<'all' | 'flagged' | 'active' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

  // Add course form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Course['category']>('Development');
  const [formInstructor, setFormInstructor] = useState('');
  const [formCoupon, setFormCoupon] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formPrice, setFormPrice] = useState('99.99');
  const [formExpiryHours, setFormExpiryHours] = useState('48');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState('');
  const [formErrorMsg, setFormErrorMsg] = useState('');

  // On mount check saved auth key
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_secret_key');
    if (savedKey) {
      setAdminKey(savedKey);
      verifyAuth(savedKey);
    }
  }, []);

  const verifyAuth = async (keyToTest: string) => {
    setAuthenticating(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyToTest }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_secret_key', keyToTest);
        fetchAdminCourses(keyToTest);
      } else {
        setAuthError(data.error || 'Invalid Key');
        setIsAuthenticated(false);
      }
    } catch (e) {
      setAuthError('Authentication network error');
    } finally {
      setAuthenticating(false);
    }
  };

  const fetchAdminCourses = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to fetch admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAuth(adminKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_secret_key');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  // Actions: Reset reports, Expire, Re-activate, Toggle Featured, Delete
  const handleCourseAction = async (id: string, action: string) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? data.course : c))
        );
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course permanently?')) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Trigger Scraper Sync
  const handleSyncPipeline = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch('/api/sync-coupons', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(
          `Synced ${data.total_courses} courses (${data.active_courses} active, ${data.newIngested} new, ${data.expired_cleaned} expired)`
        );
        fetchAdminCourses(adminKey);
      } else {
        setSyncMessage(data.error || 'Pipeline sync error');
      }
    } catch (e) {
      setSyncMessage('Pipeline sync error');
    } finally {
      setSyncing(false);
    }
  };

  // Create New Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccessMsg('');
    setFormErrorMsg('');

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          instructor: formInstructor,
          coupon_code: formCoupon,
          raw_udemy_url: formUrl,
          original_price: formPrice,
          expiry_hours: formExpiryHours,
          is_featured: formFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCourses((prev) => [data.course, ...prev]);
        setFormSuccessMsg('Course added successfully!');
        try { confetti({ particleCount: 30, spread: 60 }); } catch (e) {}
        
        // Reset form
        setFormTitle('');
        setFormInstructor('');
        setFormCoupon('');
        setFormUrl('');
        setActiveTab('manage');
      } else {
        setFormErrorMsg(data.error || 'Failed to add course');
      }
    } catch (err) {
      console.error('Add course error:', err);
      setFormErrorMsg('Failed to add course');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Broadcast Telegram / WhatsApp Draft Copy Generator
  const handleCopyBroadcastDraft = (course: Course) => {
    const origin = getPublicSiteOrigin();
    const postText = `🔥 [100% FREE UDEMY COURSE ALERT] 🔥\n\n🎓 Course: ${course.title}\n⭐ Rating: ${course.rating.toFixed(1)} | 💰 Price: $0 ($${course.original_price} Value)\n🔑 Coupon Code: ${course.coupon_code}\n\n⏰ Claim before coupon expires:\n👉 ${origin}/course/${course.id}?utm_source=telegram&utm_medium=broadcast`;

    navigator.clipboard.writeText(postText);
    setCopiedCourseId(course.id);
    setTimeout(() => setCopiedCourseId(null), 2500);
  };

  // Computed Metrics
  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((c) => !c.is_expired).length;
    const expired = courses.filter((c) => c.is_expired).length;
    const flagged = courses.filter((c) => c.report_count > 0).length;
    const totalSavings = courses.reduce((acc, c) => acc + c.original_price, 0);

    return { total, active, expired, flagged, totalSavings };
  }, [courses]);

  // Filtered Courses for Table
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (statusFilter === 'flagged') {
      list = list.filter((c) => c.report_count > 0);
    } else if (statusFilter === 'active') {
      list = list.filter((c) => !c.is_expired);
    } else if (statusFilter === 'expired') {
      list = list.filter((c) => c.is_expired);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.coupon_code.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [courses, statusFilter, searchQuery]);

  // 1. Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin Access Gate</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your Admin Secret PIN to unlock system controls</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                ADMIN SECRET KEY
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter Secret Key (Default: admin123)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
              {authError && <p className="text-xs text-red-400 mt-1.5 font-medium">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              {authenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Unlock Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard Screen
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <AdminHeader
        onLogout={handleLogout}
        onSyncPipeline={handleSyncPipeline}
        syncing={syncing}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
        
        {/* Sync Pipeline Alert Message */}
        {syncMessage && (
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs font-mono flex items-center justify-between">
            <span>⚡️ {syncMessage}</span>
            <button onClick={() => setSyncMessage('')} className="text-indigo-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Analytics Ticker Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Active Deals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400 font-mono">{stats.active}</span>
              <span className="text-xs text-slate-400">of {stats.total} total</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Reported Flags</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black font-mono ${stats.flagged > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {stats.flagged}
              </span>
              <span className="text-xs text-slate-500">Needs Review</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Expired Deals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-400 font-mono">{stats.expired}</span>
              <span className="text-xs text-slate-500">Auto-suppressed</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Catalog Dollar Value</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-300 font-mono">${stats.totalSavings.toFixed(0)}</span>
              <span className="text-xs text-slate-500">100% Saved</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Course Catalog & Moderation ({filteredCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'add' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Add New Course
            </button>
          </div>
        </div>

        {/* TAB 1: Course Catalog & Moderation Table */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter courses or coupon codes..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400 font-medium">Status:</span>
                {(['all', 'flagged', 'active', 'expired'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize font-semibold ${
                      statusFilter === st
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {st} {st === 'flagged' && stats.flagged > 0 && `(${stats.flagged})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Course Title & Category</th>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Status & Flags</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCourses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="p-4 max-w-sm">
                          <div className="flex items-center gap-2">
                            {c.is_featured && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                                FEATURED
                              </span>
                            )}
                            <span className="font-bold text-white truncate block">{c.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">{c.category} • {c.instructor}</span>
                        </td>

                        <td className="p-4 font-mono">
                          <span className="px-2.5 py-1 rounded bg-slate-950 text-indigo-300 border border-slate-800 font-bold">
                            {c.coupon_code}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {c.is_expired ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                EXPIRED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ACTIVE
                              </span>
                            )}

                            {c.report_count > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {c.report_count} Reports
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reset Reports Flag */}
                            {c.report_count > 0 && (
                              <button
                                onClick={() => handleCourseAction(c.id, 'reset_reports')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold"
                                title="Reset community reports to zero"
                              >
                                Reset Flags
                              </button>
                            )}

                            {/* Expire / Unexpire */}
                            <button
                              onClick={() => handleCourseAction(c.id, c.is_expired ? 'unexpire' : 'expire')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                            >
                              {c.is_expired ? 'Re-activate' : 'Force Expire'}
                            </button>

                            {/* Copy Telegram Broadcast Draft */}
                            <button
                              onClick={() => handleCopyBroadcastDraft(c)}
                              className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 ${
                                copiedCourseId === c.id
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                  : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30'
                              }`}
                              title="Copy Telegram/WhatsApp post format with UTM tracking"
                            >
                              {copiedCourseId === c.id ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                              <span>Draft</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Add New Course Web Form */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Add New 100% Free Course</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter details below. Destination URL will automatically be wrapped with Rakuten affiliate tracking.
              </p>
            </div>

            {formSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                ✓ {formSuccessMsg}
              </div>
            )}
            {formErrorMsg && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                {formErrorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Python 3 Masterclass 2026"
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {['Development', 'IT & Security', 'Business', 'Design', 'Marketing', 'Data Science', 'Personal Development'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    placeholder="e.g. Tim Buchalka"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Udemy Coupon Code *</label>
                  <input
                    type="text"
                    value={formCoupon}
                    onChange={(e) => setFormCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. FREE2026AUG"
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Udemy Link *</label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://www.udemy.com/course/python-masterclass/"
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              {/* Auto Rakuten Deep Link Preview */}
              {formUrl && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <span className="text-indigo-400 font-bold block">Rakuten Deep Link Preview:</span>
                  <p className="truncate text-slate-500">
                    {generateUdemyAffiliateUrl(formUrl, formCoupon, 'admin_portal')}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mark as Featured Deal</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="flex-1 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Publish 100% Free Course'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
