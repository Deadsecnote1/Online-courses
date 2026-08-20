'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Course } from '@/types/course';
import { formatTimeRemaining, formatPrice } from '@/utils/affiliate';
import { getPublicSiteOrigin, getSecondaryOfferUrl } from '@/utils/offers';
import { X, Star, Clock, Copy, Check, ExternalLink, Flag, Globe, Award, BookOpen, Send, MessageCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onReportClick: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onReportClick,
}) => {
  const [copied, setCopied] = useState(false);

  if (!course) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(course.coupon_code);
    setCopied(true);
    try {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    window.open(course.destination_url, '_blank', 'noopener,noreferrer');
  };

  const dealUrl = `${getPublicSiteOrigin()}/course/${course.id}`;
  const shareText = encodeURIComponent(
    `🔥 100% FREE UDEMY COURSE: ${course.title}\nGrab it for $0 before coupon expires!\n👉 Claim here: ${dealUrl}`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 w-full bg-slate-950">
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-lg font-mono">
              100% OFF COUPON ACTIVE
            </span>
            <span className="text-xs text-amber-400 font-mono bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {formatTimeRemaining(course.expires_at)}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
              {course.title}
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Rating</span>
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-amber-400 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Duration</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 block">{course.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Original Price</span>
              <span className="text-xs font-bold text-slate-400 line-through mt-0.5 block">{formatPrice(course.original_price)}</span>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider font-mono">
                Verified Udemy Coupon Code
              </span>
              <span className="text-xs text-emerald-400 font-bold font-mono">$0 Checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-indigo-500/40 text-center">
                <span className="font-mono text-base font-extrabold text-indigo-300 tracking-wider">
                  {course.coupon_code}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Secondary Contextual Affiliate Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Recommended Developer Tool</h4>
                <p className="text-[11px] text-slate-400">Get 70% OFF VPN lab security or $100 Cloud Credits.</p>
              </div>
            </div>
            <a
              href={getSecondaryOfferUrl('vpn')}
              target={getSecondaryOfferUrl('vpn').startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 whitespace-nowrap"
            >
              Claim Offer →
            </a>
          </div>

          {/* Main Redirect Button */}
          <button
            onClick={handleClaim}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Enroll Now on Udemy for 100% Free</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Share & Report Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <button
              onClick={() => onReportClick(course)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Broken Coupon</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Share deal:</span>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(dealUrl)}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
