/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Wand2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bot,
  Sparkles,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface PromptWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrompt: (assembledPrompt: string) => void;
}

export const PromptWizardModal: React.FC<PromptWizardModalProps> = ({
  isOpen,
  onClose,
  onApplyPrompt
}) => {
  const [step, setStep] = useState(1);

  // Form states
  const [task, setTask] = useState('');
  const [role, setRole] = useState('Senior Subject Matter Expert');
  const [customRole, setCustomRole] = useState('');
  const [audience, setAudience] = useState('Beginners with clear real-world examples');
  const [format, setFormat] = useState('Markdown Table with key takeaways');
  const [customFormat, setCustomFormat] = useState('');
  const [constraints, setConstraints] = useState('Keep under 300 words, avoid corporate buzzwords, skip conversational preamble');

  if (!isOpen) return null;

  const resolvedRole = customRole.trim() || role;
  const resolvedFormat = customFormat.trim() || format;

  const assembledPrompt = `Act as an expert ${resolvedRole}.

Task:
${task.trim() || '[Your specific goal or question]'}

Audience:
Tailored for ${audience}.

Output Format:
${resolvedFormat}.

Constraints:
${constraints}.`;

  const handleFinish = () => {
    onApplyPrompt(assembledPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Prompt Builder Wizard
              </h3>
              <p className="text-xs text-slate-400">Step {step} of 4 — Assemble a world-class prompt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 1: The Core Objective
                </span>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  What do you want the AI to do?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  State the core topic or task using an active verb (e.g., "Analyze", "Compare", "Draft", or "Explain step-by-step").
                </p>
              </div>

              <div>
                <textarea
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  placeholder="e.g. Compare PostgreSQL and MongoDB for a real-time analytics dashboard with 10k writes/sec"
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-slate-400 self-center">Ideas:</span>
                {[
                  'Explain the fundamentals of quantum computing',
                  'Draft a cold sales outreach email for SaaS founders',
                  'Debug a high memory usage issue in Node.js',
                  'Summarize the key takeaways of a quarterly report'
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTask(idea)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 2: Persona & Audience
                </span>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  Who should the AI be, and who is reading this?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Assigning a persona primes domain knowledge; setting the audience prevents explanations from being too simple or overly academic.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  AI Persona (Role):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Senior Software Architect',
                    'Direct-Response Copywriter',
                    'Patient Socratic Tutor',
                    'Management Consultant',
                    'Investigative Journalist',
                    'Executive Strategist'
                  ].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setCustomRole('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition font-medium ${
                        role === r && !customRole
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter a custom role (e.g. Pediatric Pulmonologist)..."
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Target Audience:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Beginners with clear real-world analogies',
                    'Busy executives needing bulleted bottom-line takeaways',
                    'Experienced professionals with deep technical vocabulary',
                    'High school students preparing for exams'
                  ].map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAudience(a)}
                      className={`p-2 rounded-xl border text-left transition ${
                        audience === a
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 3: Deliverable & Format
                </span>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  How should the response be structured?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Stop endless unstructured paragraphs. Demand tables, bullet lists, or step-by-step guides.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  'Markdown Table with Feature, Benefit, and Use Case columns',
                  '5 Actionable Bullet Points with bold key takeaways',
                  'Step-by-Step Numbered Guide with code examples',
                  'Executive Memo (BLUF summary, analysis, risk matrix)',
                  'Two-column Pros & Cons comparison',
                  'JSON schema with strictly typed key-value pairs'
                ].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFormat(f);
                      setCustomFormat('');
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      format === f && !customFormat
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Or custom format (e.g. 3 subject line variations followed by 200-word body)..."
                value={customFormat}
                onChange={e => setCustomFormat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 4: Guardrails & Preview
                </span>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  Add constraints & review your assembled prompt
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tell the AI what NOT to do (avoid jargon, limit word counts, skip conversational greetings).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Negative Constraints:
                </label>
                <input
                  type="text"
                  value={constraints}
                  onChange={e => setConstraints(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assembled Prompt Preview:
                </span>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {assembledPrompt}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Open in Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
