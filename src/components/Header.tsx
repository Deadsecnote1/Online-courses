'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Send, MessageCircle, Flame, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { CategoryFilter } from '@/types/course';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  activeCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: CategoryFilter[] = [
    'All',
    'Development',
    'IT & Security',
    'Business',
    'Design',
    'Marketing',
    'Data Science',
    'Personal Development',
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900/60 border-b border-indigo-500/20 text-xs py-1.5 px-4 text-center font-medium text-indigo-200 flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Flame className="w-3 h-3 mr-1 text-emerald-400 fill-emerald-400" /> LIVE DEALS
        </span>
        <span>{activeCount} active 100% OFF Udemy coupon codes verified today!</span>
        <span className="hidden md:inline text-indigo-400">• Updated every 6 hours</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  FREE<span className="text-indigo-400">COURSES</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  100% OFF
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Udemy Discount Coupon Aggregator</p>
            </div>
          </Link>

          {/* Search Input Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Python, AWS, Cyber Security, Web Dev..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Links & Broadcast Channels */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Telegram Channel
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Alerts
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search free courses..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/50 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold"
            >
              <Send className="w-4 h-4" /> Telegram Broadcast
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Alerts
            </a>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <Link href="/privacy-policy" className="block hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="block hover:text-white">Terms of Service</Link>
            <Link href="/affiliate-disclosure" className="block hover:text-white">Affiliate Disclosure</Link>
          </div>
        </div>
      )}
    </header>
  );
};
