/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PromptIssue } from '../../lib/rules/types.ts';
import { AlertCircle, AlertTriangle, Sparkles, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface SuggestionCardProps {
  issue: PromptIssue;
  onAccept: (replacementText: string) => void;
  onDismiss: () => void;
  onClose: () => void;
  positionStyle?: React.CSSProperties;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  issue,
  onAccept,
  onDismiss,
  onClose,
  positionStyle
}) => {
  const getSeverityBadge = () => {
    switch (issue.severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
          label: 'Critical Issue',
          bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900',
        };
      case 'important':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          label: 'Important',
          bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900',
        };
      case 'style':
        return {
          icon: <Sparkles className="w-4 h-4 text-sky-500" />,
          label: 'Style & Precision',
          bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-900',
        };
      case 'good':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          label: 'Good Element Detected',
          bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div
      style={positionStyle}
      className="z-50 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 transition-all duration-150 animate-in fade-in zoom-in-95 text-left"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
            {badge.icon}
            {badge.label}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            "{issue.highlightText.length > 20 ? issue.highlightText.substring(0, 18) + '...' : issue.highlightText}"
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {issue.message}
      </h4>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {issue.explanation}
      </p>

      {/* Suggested replacements */}
      {issue.suggestions && issue.suggestions.length > 0 && (
        <div className="space-y-1.5 mb-3">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Suggested Replacements
          </span>
          <div className="space-y-1">
            {issue.suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onAccept(sug.text)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-600 transition flex items-center justify-between group"
              >
                <div className="truncate pr-2">
                  <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {sug.label || sug.text}
                  </span>
                  {sug.description && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {sug.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {issue.suggestions && issue.suggestions.length > 0 ? (
          <button
            onClick={() => onAccept(issue.suggestions[0].text)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition"
          >
            Accept ({issue.suggestions[0].label || 'Fix'})
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1 rounded transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
