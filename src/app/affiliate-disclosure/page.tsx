import React from 'react';
import Link from 'next/link';
import { DollarSign, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Affiliate Disclosure | FTC Compliance',
  description: 'FTC compliant affiliate disclosure for our course links and partner referrals.',
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Free Courses
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Affiliate Disclosure</h1>
            <p className="text-xs text-slate-500 font-mono">FTC Compliance Statement</p>
          </div>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white">1. Transparency & Revenue Model</h2>
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines, please assume that outgoing links on this portal leading to Udemy.com, hosting providers, or software tools are affiliate referral links.
          </p>

          <h2 className="text-lg font-bold text-white">2. How Affiliate Links Work</h2>
          <p>
            When you click on a course link on our website and enroll or make a subsequent purchase on Udemy, we may receive a small referral commission from the merchant (via Rakuten Advertising) at <strong>no additional cost to you</strong>.
          </p>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-indigo-300">
            <strong>Key Guarantee:</strong> The coupon codes listed on our platform are 100% FREE ($0.00). You will never be charged extra for using our affiliate links.
          </div>

          <h2 className="text-lg font-bold text-white">3. Partner Programs</h2>
          <p>We participate in the following affiliate networks:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li><strong>Rakuten Advertising:</strong> Official affiliate network for Udemy, Inc.</li>
            <li><strong>Direct Tech Referrals:</strong> VPS cloud hosting credits (DigitalOcean, Vultr) and security tools (VPNs).</li>
          </ul>

          <h2 className="text-lg font-bold text-white">4. Support Our Platform</h2>
          <p>
            Affiliate revenue and display advertising help fund server infrastructure, API scrapers, and daily coupon verification operations, allowing us to keep this service 100% free for learners worldwide.
          </p>
        </section>
      </div>
    </main>
  );
}
