/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  BookOpen,
  LayoutGrid,
  History,
  Sun,
  Moon,
  Keyboard,
  ShieldCheck,
  PlusCircle,
  Home
} from 'lucide-react';

export type NavTab = 'editor' | 'templates' | 'learn' | 'history' | 'landing';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onNewPrompt: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenShortcuts,
  onOpenAbout,
  onNewPrompt
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('editor')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  Prompt<span className="text-indigo-600 dark:text-indigo-400">Polish</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5 hidden sm:block">
                Grammarly for AI Prompts
              </p>
            </div>
          </button>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onTabChange('editor')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => onTabChange('templates')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => onTabChange('learn')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'learn'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn & Guide</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => onTabChange('landing')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'landing'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        </nav>

        {/* Right Tools & Theme */}
        <div className="flex items-center gap-2">
          {activeTab === 'editor' && (
            <button
              onClick={onNewPrompt}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              title="Start a blank prompt"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>New Prompt</span>
            </button>
          )}

          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAbout}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Privacy & Architecture"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile nav pills bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-semibold">
        <button
          onClick={() => onTabChange('editor')}
          className={`px-2.5 py-1 rounded-lg ${activeTab === 'editor' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          Editor
        </button>
        <button
          onClick={() => onTabChange('templates')}
          className={`px-2.5 py-1 rounded-lg ${activeTab === 'templates' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          Templates
        </button>
        <button
          onClick={() => onTabChange('learn')}
          className={`px-2.5 py-1 rounded-lg ${activeTab === 'learn' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          Learn
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`px-2.5 py-1 rounded-lg ${activeTab === 'history' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          History
        </button>
        <button
          onClick={() => onTabChange('landing')}
          className={`px-2.5 py-1 rounded-lg ${activeTab === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          Overview
        </button>
      </div>
    </header>
  );
};
