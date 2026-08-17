'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Course, CategoryFilter } from '@/types/course';
import { INITIAL_COURSES } from '@/data/mockCourses';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CourseCard } from '@/components/CourseCard';
import { AdBanner } from '@/components/AdBanner';
import { ReportModal } from '@/components/ReportModal';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import Fuse from 'fuse.js';
import { Sparkles, TrendingUp, ShieldCheck, RefreshCw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'popular' | 'rating'>('newest');
  
  const [reportingCourse, setReportingCourse] = useState<Course | null>(null);
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);

  // Fuse.js client search setup
  const fuse = useMemo(() => {
    return new Fuse(courses, {
      keys: ['title', 'instructor', 'category', 'description', 'coupon_code'],
      threshold: 0.35,
    });
  }, [courses]);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    let result = [...courses].filter((c) => !c.is_expired);

    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((res) => res.item);
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOrder === 'popular') {
      result.sort((a, b) => b.students_count - a.students_count);
    } else if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [courses, selectedCategory, searchQuery, sortOrder, fuse]);

  // Handle Report Flag Callback
  const handleReportSuccess = (courseId: string, updatedCount: number, isExpired: boolean) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            report_count: updatedCount,
            is_expired: isExpired,
          };
        }
        return c;
      })
    );
  };

  // Stats calculation
  const totalSavings = useMemo(() => {
    return filteredCourses.reduce((acc, curr) => acc + curr.original_price, 0);
  }, [filteredCourses]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeCount={filteredCourses.length}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>100% OFF UDEMY COUPONS AGGREGATOR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Unlock Premium <span className="gradient-text">Udemy Courses</span> for $0.00
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We automatically track, verify, and publish active 100% discount coupon links across software engineering, cloud, cybersecurity, design, and business. Claim lifetime access today!
            </p>

            {/* Metrics Ribbon */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Available Deals</span>
                <span className="text-lg font-bold text-white font-mono">{filteredCourses.length} Courses</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Value Saved</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">${totalSavings.toFixed(2)}</span>
              </div>
              <div className="hidden sm:block p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Ingestion Frequency</span>
                <span className="text-lg font-bold text-indigo-300 font-mono">Every 6 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Zone: Header Leaderboard */}
        <AdBanner type="header" />

        {/* Directory Controls Bar (Sort & Filter Info) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">
              {selectedCategory === 'All' ? 'All Free Deals' : selectedCategory}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 font-mono">
              {filteredCourses.length}
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {[
                { id: 'newest', label: 'Newest' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'rating', label: 'Top Rated' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortOrder(s.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    sortOrder === s.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Card Grid with In-Feed Ad Unit Injections */}
        {filteredCourses.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white">No courses matched your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for different keywords or select &quot;All&quot; categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const showAd = (index + 1) % 6 === 0;
              return (
                <React.Fragment key={course.id}>
                  <CourseCard
                    course={course}
                    onReportClick={(c) => setReportingCourse(c)}
                    onDetailClick={(c) => setSelectedDetailCourse(c)}
                  />
                  {showAd && <AdBanner type="infeed" />}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Mobile Anchor Ad */}
      <AdBanner type="footer" />

      {/* Modals */}
      <ReportModal
        course={reportingCourse}
        onClose={() => setReportingCourse(null)}
        onSuccess={handleReportSuccess}
      />

      <CourseDetailModal
        course={selectedDetailCourse}
        onClose={() => setSelectedDetailCourse(null)}
        onReportClick={(c) => setReportingCourse(c)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
