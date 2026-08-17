'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Course } from '@/types/course';
import { formatTimeRemaining, formatPrice } from '@/utils/affiliate';
import { Star, Clock, Copy, Check, ExternalLink, Flag, Users, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseCardProps {
  course: Course;
  onReportClick: (course: Course) => void;
  onDetailClick?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onReportClick,
  onDetailClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(course.coupon_code);
    setCopied(true);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      // Confetti fallback
    }

    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(course.destination_url, '_blank', 'noopener,noreferrer');
  };

  const timeLeft = formatTimeRemaining(course.expires_at);

  return (
    <div
      onClick={() => onDetailClick?.(course)}
      className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-slate-800/80 hover:border-indigo-500/40 relative"
    >
      {/* Top Banner Image with Badges */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <Image
          src={course.image_url}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* 100% OFF Glowing Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="animate-badge-pulse px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 tracking-wider">
            100% OFF
          </span>
          {course.is_featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/80 text-white backdrop-blur-md border border-purple-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
            {course.category}
          </span>
        </div>

        {/* Countdown Ticker Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono font-bold text-[11px]">{timeLeft}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            <span className="line-through mr-1.5 font-mono text-slate-500">
              {formatPrice(course.original_price)}
            </span>
            <span className="text-emerald-400 font-bold font-mono">$0.00</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {course.description}
          </p>

          <div className="mt-3 text-[11px] text-slate-400 font-medium truncate">
            Instructor: <span className="text-slate-300 font-semibold">{course.instructor}</span>
          </div>
        </div>

        {/* Stats Row: Star rating & Student enrollment */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="ml-1 font-bold text-slate-100">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-500 font-mono">({course.reviews_count.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.students_count.toLocaleString()} students</span>
          </div>
        </div>

        {/* Coupon Code Copy Box */}
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between gap-2">
          <div className="truncate">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Udemy Coupon Code
            </span>
            <span className="font-mono text-xs font-bold text-indigo-300 tracking-wider select-all">
              {course.coupon_code}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>

        {/* Direct Action Buttons & Report Trigger */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group/btn transition-all"
          >
            <span>Get 100% Free Course</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReportClick(course);
              }}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <Flag className="w-3 h-3" />
              <span>Report Broken Code {course.report_count > 0 && `(${course.report_count})`}</span>
            </button>
            <span className="text-slate-600">• {course.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
