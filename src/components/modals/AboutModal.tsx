/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Lock, Cpu, Sparkles, Mail, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              PP
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                About & Privacy Guarantee
              </h3>
              <p className="text-xs text-slate-400">PromptPolish Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Commitment */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                Zero Cloud Storage for Live Typing
              </h4>
              <p className="text-emerald-800/90 dark:text-emerald-300/90">
                Your prompt checks run entirely inside your browser using our client-side NLP rule engine (sub-100ms latency). Nothing you type is sent over the wire during standard editing.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                AI Rewrite Transparency
              </h4>
              <p className="text-indigo-800/90 dark:text-indigo-300/90">
                Only when you explicitly click <span className="font-semibold">"Improve with AI"</span> is your prompt transmitted to the secure server endpoint. The server proxies the request directly to Gemini API and never logs, persists, or trains on your prompt text.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                Offline Capable & Local History
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Your prompt history is stored in your device's browser localStorage. You can clear or export your history as .md / .txt at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Built for AI power users & beginners worldwide</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
