'use client';

import React from 'react';

interface AdBannerProps {
  type: 'header' | 'infeed' | 'sidebar' | 'footer';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  if (type === 'header') {
    return (
      <div className={`w-full my-6 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 min-h-[100px] relative overflow-hidden ${className}`}>
        <div className="absolute top-2 right-3 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
          AdSense Leaderboard (728x90)
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
              ⚡️
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">High Speed Cloud VPS Hosting</h4>
              <p className="text-xs text-slate-400">Get $100 Free Credit on DigitalOcean / Vultr Cloud Servers.</p>
            </div>
          </div>
          <a
            href="https://click.linksynergy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 whitespace-nowrap"
          >
            Claim $100 Credit →
          </a>
        </div>
      </div>
    );
  }

  if (type === 'infeed') {
    return (
      <div className={`glass-card rounded-2xl border border-dashed border-indigo-500/30 p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-950/30 to-purple-950/20 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            Sponsored Ad
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Native In-Feed Unit</span>
        </div>

        <div className="my-2">
          <h4 className="text-base font-bold text-white mb-2 leading-tight">
            🛡️ Secure Your Hacking & Cloud Lab with 70% OFF VPN
          </h4>
          <p className="text-xs text-slate-400 line-clamp-3">
            High-speed zero-logs VPN essential for cybersecurity lab testing, web scraping, and protecting online privacy.
          </p>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-bold">Exclusive 70% Discount</span>
          <a
            href="https://click.linksynergy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md"
          >
            Get Discount →
          </a>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono block mb-2">
          AdSense Medium Rectangle (300x250)
        </span>
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          <p className="text-xs font-bold text-slate-300 mb-2">🚀 Upgrade Your Dev Toolkit</p>
          <p className="text-xs text-slate-400 mb-3">Get unlimited access to top-rated tech courses with Coursera Plus.</p>
          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold">
            Learn More
          </button>
        </div>
      </div>
    );
  }

  // Footer Sticky Mobile Anchor Banner
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-indigo-500/20 p-2.5 backdrop-blur-md flex items-center justify-between px-4 max-w-4xl mx-auto rounded-t-xl shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          SPONSORED
        </span>
        <span className="text-xs text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">
          Get 50GB Free Cloud Storage & High-Speed Developer APIs
        </span>
      </div>
      <a
        href="https://click.linksynergy.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap"
      >
        Free Signup →
      </a>
    </div>
  );
};
