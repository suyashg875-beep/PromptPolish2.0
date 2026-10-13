/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RewriteResponse } from '../../lib/ai/rewriteService.ts';
import {
  X,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrompt: string;
  originalScore: number;
  rewriteResult: RewriteResponse | null;
  onApplyImproved: (newPrompt: string) => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  originalPrompt,
  originalScore,
  rewriteResult,
  onApplyImproved
}) => {
  const [copied, setCopied] = useState(false);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<number, string>>({});
  const [customizedPrompt, setCustomizedPrompt] = useState<string | null>(null);

  if (!isOpen || !rewriteResult) return null;

  const currentImproved = customizedPrompt || rewriteResult.improvedPrompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentImproved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy prompt:', e);
    }
  };

  const handleAnswerClarification = (index: number, answer: string) => {
    setClarifyingAnswers(prev => ({ ...prev, [index]: answer }));
  };

  const handleInjectAnswers = () => {
    const answeredEntries = Object.entries(clarifyingAnswers).filter(([_, val]) => val.trim().length > 0);
    if (answeredEntries.length === 0) return;

    let injection = '\n\nClarifications & Context:\n';
    answeredEntries.forEach(([idx, ans]) => {
      const q = rewriteResult.missingInfoQuestions[Number(idx)];
      injection += `- ${q} ${ans.trim()}\n`;
    });

    setCustomizedPrompt(currentImproved + injection);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>AI Prompt Rewrite</span>
                {rewriteResult.isFallback && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    Smart Rule Synthesizer
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side comparison with engineering annotations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">
                {originalScore} pts
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-3.5 h-3.5" />
                {rewriteResult.newScore} pts
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Regional Language Detected & Translated Notice */}
          {rewriteResult.detectedLanguage && rewriteResult.detectedLanguage !== 'English' && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                  {rewriteResult.detectedLanguage}
                </span>
                <span className="text-amber-900 dark:text-amber-200 font-medium">
                  {rewriteResult.translatedIntentSummary || `Original prompt understood in ${rewriteResult.detectedLanguage} and engineered into high-performance English.`}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ Converted to English
              </span>
            </div>
          )}

          {/* Side-by-side Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Before (Original) */}
            <div className="flex flex-col rounded-2xl border border-rose-200 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/20 p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-100 dark:border-rose-900/60">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Before {rewriteResult.detectedLanguage && rewriteResult.detectedLanguage !== 'English' ? `(${rewriteResult.detectedLanguage})` : '(Original)'}
                </span>
                <span className="text-xs text-rose-500/80 font-mono">
                  Score: {originalScore}/100
                </span>
              </div>
              <div className="flex-1 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text p-2 bg-white/70 dark:bg-slate-950/40 rounded-xl border border-rose-100/80 dark:border-rose-900/40 overflow-y-auto max-h-[320px]">
                {originalPrompt}
              </div>
            </div>

            {/* After (Polished) */}
            <div className="flex flex-col rounded-2xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100 dark:border-emerald-900/60">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  After (Engineered English Prompt)
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  Score: {rewriteResult.newScore}/100
                </span>
              </div>
              <div className="flex-1 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed select-text p-2 bg-white/70 dark:bg-slate-950/40 rounded-xl border border-emerald-100/80 dark:border-emerald-900/40 overflow-y-auto max-h-[320px]">
                {currentImproved}
              </div>
            </div>
          </div>

          {/* Why This is Better Breakdown */}
          {rewriteResult.changes && rewriteResult.changes.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Why This Prompt Yields 10x Better Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rewriteResult.changes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs"
                  >
                    <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      {item.what}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clarifying Questions (if returned) */}
          {rewriteResult.missingInfoQuestions && rewriteResult.missingInfoQuestions.length > 0 && (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Refine Intent: Clarifying Questions
                </h4>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                Type quick details below to automatically inject them into your prompt:
              </p>
              <div className="space-y-2">
                {rewriteResult.missingInfoQuestions.map((q, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 sm:w-1/2">
                      {q}
                    </span>
                    <input
                      type="text"
                      placeholder="Your answer (optional)..."
                      value={clarifyingAnswers[idx] || ''}
                      onChange={e => handleAnswerClarification(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleInjectAnswers}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Prompt with Answers</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            Keep Original
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Polished Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onApplyImproved(currentImproved);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Replace in Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
