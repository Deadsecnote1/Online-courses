import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | 100% Free Udemy Course Aggregator',
  description: 'Terms of service governing the usage of our free course coupon aggregation portal.',
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Free Courses
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Terms of Service</h1>
            <p className="text-xs text-slate-500 font-mono">Last Updated: August 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white">1. Platform Services</h2>
          <p>
            This portal aggregates promotional 100% discount coupon links made publicly available by course instructors and platforms. We do not host, store, or directly sell course content. All learning transactions occur on Udemy.com.
          </p>

          <h2 className="text-lg font-bold text-white">2. Coupon Code Availability Disclaimer</h2>
          <p>
            Promotional coupons on Udemy are subject to instructor quotas (typically 1,000 redemptions per code) and strict expiration windows (24 to 72 hours). While our automated pipeline syncs every 6 hours, we cannot guarantee that every coupon code will remain valid at the time of your visit.
          </p>

          <h2 className="text-lg font-bold text-white">3. Intellectual Property & Trademarks</h2>
          <p>
            &quot;Udemy&quot; is a registered trademark of Udemy, Inc. This website is an independent promotional aggregator and is not directly endorsed, sponsored, or affiliated with Udemy, Inc. beyond standard affiliate marketing partnerships.
          </p>

          <h2 className="text-lg font-bold text-white">4. Community Flagging & Fair Use</h2>
          <p>
            Users are encouraged to use the &quot;Report Expired&quot; feature in good faith to flag dead deals. Misuse or automated spamming of report triggers is prohibited.
          </p>
        </section>
      </div>
    </main>
  );
}
