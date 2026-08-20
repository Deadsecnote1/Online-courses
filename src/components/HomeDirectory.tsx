'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Course, CategoryFilter } from '@/types/course';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CourseCard } from '@/components/CourseCard';
import { AdBanner } from '@/components/AdBanner';
import { ReportModal } from '@/components/ReportModal';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { filterDirectory, DirectorySort } from '@/utils/directory';
import { INITIAL_COURSES } from '@/data/mockCourses';
import { Sparkles, ArrowUpDown } from 'lucide-react';

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Development',
  'IT & Security',
  'Business',
  'Design',
  'Marketing',
  'Data Science',
  'Personal Development',
];

export function HomeDirectory() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortOrder, setSortOrder] = useState<DirectorySort>('newest');
  const [reportingCourse, setReportingCourse] = useState<Course | null>(null);
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat as CategoryFilter)) {
      setSelectedCategory(cat as CategoryFilter);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/courses?include_expired=1')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses(INITIAL_COURSES);
          setLoadError('Could not load live catalog; showing seed deals');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCourses(INITIAL_COURSES);
          setLoadError('Could not load live catalog; showing seed deals');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCourses = useMemo(
    () =>
      filterDirectory(courses, {
        searchQuery,
        category: selectedCategory,
        sortOrder,
        includeExpired: false,
      }),
    [courses, selectedCategory, searchQuery, sortOrder]
  );

  const handleReportSuccess = (courseId: string, updatedCount: number, isExpired: boolean) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, report_count: updatedCount, is_expired: isExpired } : c
      )
    );
  };

  const totalSavings = useMemo(
    () => filteredCourses.reduce((acc, curr) => acc + curr.original_price, 0),
    [filteredCourses]
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeCount={filteredCourses.length}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
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
            {loadError && <p className="text-xs text-amber-400 font-mono">{loadError}</p>}
          </div>
        </div>

        <AdBanner type="header" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">
              {selectedCategory === 'All' ? 'All Free Deals' : selectedCategory}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 font-mono">
              {filteredCourses.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="flex flex-wrap bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {[
                { id: 'newest', label: 'Newest' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'expiry', label: 'Expiry Soonest' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortOrder(s.id as DirectorySort)}
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
          <div className="flex gap-6 items-start">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
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
            <aside className="hidden xl:block w-[300px] shrink-0">
              <div className="sticky top-28">
                <AdBanner type="sidebar" />
              </div>
            </aside>
          </div>
        )}
      </main>

      <AdBanner type="footer" />

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

      <Footer />
    </div>
  );
}
