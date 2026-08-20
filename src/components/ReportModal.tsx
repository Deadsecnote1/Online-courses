'use client';

import React, { useState } from 'react';
import { Course, ReportPayload } from '@/types/course';
import { AlertTriangle, X, CheckCircle2, Loader2 } from 'lucide-react';

interface ReportModalProps {
  course: Course | null;
  onClose: () => void;
  onSuccess: (courseId: string, updatedCount: number, isExpired: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  course,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<ReportPayload['reason']>('expired_code');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/report-expired', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          reason,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess(course.id, data.report_count, data.is_expired);
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'Report failed');
      }
    } catch (err) {
      console.error('Report submission failed:', err);
      setError('Report failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Report Dead Deal / Broken Code</h3>
            <p className="text-xs text-slate-400">Help the community keep 100% free deals updated</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Thank You for Reporting!</h4>
            <p className="text-xs text-slate-400">
              Our automated expiration engine has updated the community report counter.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <p className="text-xs font-semibold text-indigo-300 truncate">{course.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Code: {course.coupon_code}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">What is wrong with this deal?</label>
              <div className="space-y-2">
                {[
                  { id: 'expired_code', label: 'Coupon code has expired on Udemy' },
                  { id: 'wrong_price', label: 'Price is not 100% FREE ($0)' },
                  { id: 'broken_link', label: 'Link redirect is broken / 404 error' },
                  { id: 'other', label: 'Other issue' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      reason === opt.id
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={opt.id}
                      checked={reason === opt.id}
                      onChange={() => setReason(opt.id as any)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Additional details (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Shows $12.99 at checkout..."
                rows={2}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && <p className="text-xs text-amber-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Flag'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
