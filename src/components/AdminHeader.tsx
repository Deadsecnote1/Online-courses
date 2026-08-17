'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, LogOut, ExternalLink, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  onSyncPipeline: () => void;
  syncing: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  onSyncPipeline,
  syncing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-indigo-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white font-mono">
                  ADMIN<span className="text-indigo-400">CONTROL</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  LIVE PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Platform Operations & Revenue Console</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSyncPipeline}
              disabled={syncing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Scraper Pipeline</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5"
              title="Lock Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
