'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Course } from '@/types/course';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { ReportModal } from '@/components/ReportModal';

export default function CourseDealPage() {
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [missing, setMissing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/courses?id=${encodeURIComponent(params.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.course) setCourse(data.course);
        else setMissing(true);
      })
      .catch(() => setMissing(true));
  }, [params?.id]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory="All"
        onSelectCategory={() => {
          window.location.href = '/';
        }}
        activeCount={course && !course.is_expired ? 1 : 0}
      />

      <main className="flex-1 flex items-center justify-center p-6">
        {missing && (
          <div className="text-center space-y-3">
            <h1 className="text-xl font-bold text-white">Deal not found</h1>
            <p className="text-xs text-slate-400">This coupon may have been removed from the catalog.</p>
            <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Back to Free Courses
            </Link>
          </div>
        )}
      </main>

      {course && (
        <CourseDetailModal
          course={course}
          onClose={() => {
            window.location.href = '/';
          }}
          onReportClick={() => setReporting(true)}
        />
      )}

      <ReportModal
        course={reporting ? course : null}
        onClose={() => setReporting(false)}
        onSuccess={() => setReporting(false)}
      />

      <Footer />
    </div>
  );
}
