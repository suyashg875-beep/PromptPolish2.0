/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Bot,
  HelpCircle,
  TrendingUp,
  Layout,
  Cpu,
  Layers,
  ChevronDown
} from 'lucide-react';
import { BAD_GOOD_EXAMPLES } from '../../data/examples.ts';

interface LandingPageProps {
  onStartEditor: (promptText?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartEditor }) => {
  const [demoPrompt, setDemoPrompt] = useState('write about cats');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How is PromptPolish different from normal grammar checkers?',
      a: 'Grammarly fixes English syntax; PromptPolish fixes AI prompt architecture. It checks whether you declared a domain role, specified clear action verbs, defined structured output formats (like Markdown tables or bullet steps), and placed boundaries to avoid robotic fluff.'
    },
    {
      q: 'Does PromptPolish store my prompts or train on them?',
      a: 'Never. The real-time rule engine runs 100% locally in your browser with zero network requests. If you click "Improve with AI", the server proxies your prompt directly to Gemini API without logging or storing your text.'
    },
    {
      q: 'Which AI tools work best with these prompts?',
      a: 'All modern LLMs and image tools! The prompts are designed for ChatGPT (GPT-4o), Google Gemini, Anthropic Claude (with XML tags), Meta AI, DeepSeek, and image generators like Midjourney.'
    },
    {
      q: 'Can I type prompts in Marathi, Hindi, or my regional language?',
      a: 'Yes, absolutely! Whether you type in native Devanagari script (e.g. "मांजर बद्दल माहिती द्या") or transliterated Roman text ("mala prompt lihaycha ahe"), PromptPolish detects your regional language, understands your core intent, and automatically translates and engineers it into an elite English prompt for ChatGPT, Claude, and Gemini.'
    }
  ];

  return (
    <div className="space-y-24 pb-20 animate-in fade-in">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>The Grammarly for AI Prompts</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">Supports Marathi & Regional Languages → English</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
          Stop blaming the AI.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Polish your prompt
          </span>{' '}
          in real time.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Type naturally in <strong>English, Marathi (मराठी), Hindi</strong>, or any regional language. We detect your intent, underline weaknesses, and convert it into world-class English prompt architecture.
        </p>

        {/* Live Interactive Hero Demo Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Interactive Hero Sandbox
              </span>
              <span className="text-slate-400 font-normal hidden sm:inline">
                (Try typing or editing below)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                Score: 18/100 (Needs work)
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 p-4 border border-slate-200/60 dark:border-slate-800/80">
            <textarea
              value={demoPrompt}
              onChange={e => setDemoPrompt(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-sans text-lg font-medium resize-none focus:outline-none"
            />

            {/* Interactive Annotation Overlay Mock */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100/70 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Vague Verb: "write about"
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Missing Role ("Act as...")
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Missing Output Format (table / bullets)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              💡 One click upgrades this prompt to score 96/100
            </span>

            <button
              onClick={() => onStartEditor(demoPrompt)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Polish This Prompt in Live Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Effortless Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How PromptPolish Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Write naturally. We provide real-time guidance so you get the highest quality AI answer on the first attempt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center text-lg border border-rose-200/80 dark:border-rose-900/60">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Instant Live Underlines
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              As you type, our 12 client-side NLP detectors flag missing roles, vague verbs, missing constraints, and filler words in under 100 milliseconds.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-lg border border-amber-200/80 dark:border-amber-900/60">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              One-Click Replacements
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Click any underline to open a plain-language card with 1–3 tailored suggestions. Accept fixes instantly or insert structure templates from the checklist.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-lg border border-emerald-200/80 dark:border-emerald-900/60">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              AI Rewrite & 100-Point Score
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Watch your score climb to 90+. Click "Improve with AI" to generate a side-by-side diff with why-it-is-better annotations, then copy directly into ChatGPT or Claude.
            </p>
          </div>
        </div>
      </section>

      {/* Before vs After Showcase Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Real Transformations
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            See the Difference Precision Makes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BAD_GOOD_EXAMPLES.slice(0, 2).map(ex => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {ex.topic}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  +{ex.goodScore - ex.badScore} pts
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
                  ✗ "{ex.badPrompt}"
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  ✓ {ex.goodPrompt}
                </div>
              </div>

              <button
                onClick={() => onStartEditor(ex.goodPrompt)}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                Open in Editor
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about the Grammarly for AI prompts
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>

              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-indigo-500/20">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to craft world-class AI prompts?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed">
            No registration required. Free, instant, and private in your browser.
          </p>
          <div>
            <button
              onClick={() => onStartEditor()}
              className="px-8 py-3 rounded-2xl bg-white text-indigo-600 font-bold text-sm hover:bg-slate-100 shadow-md transition cursor-pointer"
            >
              Launch PromptPolish Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
