import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

const DOMAIN_LINKS: { href: string; label: string }[] = [
  { href: '/?category=Development', label: 'Python & Software Dev' },
  { href: '/?category=IT%20%26%20Security', label: 'Ethical Hacking & Cyber Security' },
  { href: '/?category=IT%20%26%20Security', label: 'AWS & Cloud DevOps' },
  { href: '/?category=Design', label: 'UI/UX & Figma Design' },
  { href: '/?category=Marketing', label: 'Digital Marketing & SEO' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-white font-mono">
              FREE<span className="text-indigo-400">COURSES</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Aggregating 100% free Udemy discount coupon codes, updated every 6 hours. Save hundreds on top-rated technical education.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px] font-mono">Popular Domains</h4>
          <ul className="space-y-2">
            {DOMAIN_LINKS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-indigo-300 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px] font-mono">Legal & Compliance</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-indigo-300 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/affiliate-disclosure" className="hover:text-indigo-300 transition-colors">
                Affiliate Disclosure
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px] font-mono">System Architecture</h4>
          <p className="text-slate-400 mb-3 text-xs leading-relaxed">
            Built using Next.js App Router, Fuse.js search engine, and an Obsidian PARA Second Brain pipeline.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <span className="text-indigo-400 font-bold font-mono">Pipeline Status:</span> Active 6h Cron Sync
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center space-y-2 text-slate-500">
        <p>Disclaimer: Udemy is a trademark of Udemy, Inc. This site is not endorsed by Udemy.</p>
        <p className="flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Independent coupon aggregator. Not affiliated with Udemy, Inc. except via advertising networks.
        </p>
        <p className="flex items-center justify-center gap-1.5">
          <ExternalLink className="w-3.5 h-3.5" /> Some links are affiliate links. See our disclosure for details.
        </p>
      </div>
    </footer>
  );
};
