/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROMPT_GUIDE_SECTIONS } from '../../data/learningGuide.ts';
import { BAD_GOOD_EXAMPLES, BadGoodExample } from '../../data/examples.ts';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Zap,
  Users,
  Compass,
  Layout,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface LearnViewProps {
  onLoadPrompt: (promptText: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onLoadPrompt }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'showcase'>('showcase');

  const getGuideIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'Users': return <Users className="w-5 h-5 text-blue-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-500" />;
      case 'Layout': return <Layout className="w-5 h-5 text-purple-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Master Prompt Engineering
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Learn why vague prompts fail, explore annotated before/after teardowns, and master the 5 core elements of high-performing AI prompts.
        </p>

        {/* Tab switch */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-2">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'showcase'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Bad → Good Showcase
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Prompt Writing Basics Guide
          </button>
        </div>
      </div>

      {/* Showcase Tab */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {BAD_GOOD_EXAMPLES.map(ex => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs overflow-hidden space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-900/60">
                    {ex.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {ex.topic}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoadPrompt(ex.badPrompt)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-medium cursor-pointer"
                  >
                    Test Bad Prompt in Editor
                  </button>
                  <button
                    onClick={() => onLoadPrompt(ex.goodPrompt)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Use Good Prompt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bad Prompt Card */}
                <div className="rounded-2xl border border-rose-200/80 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Weak Prompt
                    </span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                      Score: {ex.badScore}/100
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-950/60 rounded-xl border border-rose-100 dark:border-rose-900/40 font-mono text-xs text-slate-800 dark:text-slate-200">
                    "{ex.badPrompt}"
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                      Why It Fails:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {ex.badFlaws.map((flaw, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{flaw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Good Prompt Card */}
                <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Polished Prompt
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      Score: {ex.goodScore}/100
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-950/60 rounded-xl border border-emerald-100 dark:border-emerald-900/40 font-mono text-xs text-slate-800 dark:text-slate-200 max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {ex.goodPrompt}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Why It Excels:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {ex.goodWins.map((win, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Takeaway */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Key Lesson: </span>
                  {ex.whyItMatters}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {PROMPT_GUIDE_SECTIONS.map(section => (
            <div
              key={section.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40">
                  {getGuideIcon(section.iconName)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* Formula & Key Rule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    The Formula
                  </span>
                  <div className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {section.formula}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Golden Rule
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.keyRule}
                  </p>
                </div>
              </div>

              {/* Real Examples */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contrast Comparison:
                </span>
                {section.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono">
                      <div className="text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-100 dark:border-rose-950">
                        ✗ {ex.weak}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-950">
                        ✓ {ex.strong}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {ex.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pro Tips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {section.proTips.map((tip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-900/60"
                  >
                    💡 {tip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
