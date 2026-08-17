import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | 100% Free Udemy Course Aggregator',
  description: 'Our privacy policy explains how we collect, use, and protect your information when using our free course discount aggregation platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Free Courses
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-500 font-mono">Last Updated: August 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to Free Course Aggregator (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to safeguarding your privacy while providing 100% free educational promotional links. This policy outlines how information is handled when you access our website.
          </p>

          <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
          <p>
            We do not require user account registration, credit cards, or personal personal identification to access our course listings. We may collect non-personal browser data, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>IP address, browser type, and operating system.</li>
            <li>Referral sources (e.g. Telegram, WhatsApp broadcast links).</li>
            <li>Page visit analytics and affiliate link click tracking via Rakuten Advertising.</li>
          </ul>

          <h2 className="text-lg font-bold text-white">3. Third-Party Advertising & Cookies</h2>
          <p>
            We partner with Google AdSense and Rakuten Advertising to display contextual advertisements and manage affiliate attribution. Third-party vendors use cookies to serve ads based on your previous visits to this or other websites:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>Google AdSense uses advertising cookies (such as DART cookies) to personalize ad units.</li>
            <li>Rakuten Advertising sets referral tracking cookies upon clicking course discount links to attribute referral commissions.</li>
          </ul>

          <h2 className="text-lg font-bold text-white">4. GDPR & CCPA Compliance</h2>
          <p>
            European Economic Area (EEA) and California residents have rights regarding data transparency. You may opt out of personalized advertising by visiting Google Ad Settings or Digital Advertising Alliance opt-out portals.
          </p>

          <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our team at <span className="text-indigo-400 font-mono">privacy@domain.com</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
