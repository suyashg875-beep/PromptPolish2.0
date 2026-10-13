/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { PromptIssue } from '../../lib/rules/types.ts';
import { detectLanguage } from '../../lib/rules/regionalLanguage.ts';
import { SuggestionCard } from './SuggestionCard.tsx';
import { Copy, Check, Trash2, ArrowLeft, ArrowRight, Sparkles, AlertCircle, AlertTriangle, Lightbulb, Globe } from 'lucide-react';

interface PromptEditorProps {
  promptText: string;
  onChange: (newText: string) => void;
  issues: PromptIssue[];
  onAcceptIssue: (issue: PromptIssue, replacementText: string) => void;
  onDismissIssue: (issueId: string) => void;
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string | null) => void;
  onTriggerRewrite?: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  promptText,
  onChange,
  issues,
  onAcceptIssue,
  onDismissIssue,
  selectedIssueId,
  onSelectIssue,
  onTriggerRewrite
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Sync scroll between textarea and backdrop
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Find currently active issue
  const activeIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return issues.find(i => i.id === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  // Navigate issues with keyboard or buttons
  const activeIndex = useMemo(() => {
    if (!selectedIssueId) return -1;
    return issues.findIndex(i => i.id === selectedIssueId);
  }, [issues, selectedIssueId]);

  const handleNextIssue = () => {
    if (issues.length === 0) return;
    const nextIdx = (activeIndex + 1) % issues.length;
    onSelectIssue(issues[nextIdx].id);
  };

  const handlePrevIssue = () => {
    if (issues.length === 0) return;
    const prevIdx = (activeIndex - 1 + issues.length) % issues.length;
    onSelectIssue(issues[prevIdx].id);
  };

  // Copy prompt to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy prompt:', e);
    }
  };

  // Detect regional language (Marathi, Hindi, etc.)
  const detectedLang = useMemo(() => {
    return detectLanguage(promptText);
  }, [promptText]);

  // Segment text for highlighting in backdrop
  const renderedSegments = useMemo(() => {
    if (!promptText) return null;

    // Filter and sort non-overlapping valid issues
    const sortedIssues = [...issues].sort((a, b) => a.range[0] - b.range[0]);
    const segments: React.ReactNode[] = [];
    let currentIndex = 0;

    for (let i = 0; i < sortedIssues.length; i++) {
      const issue = sortedIssues[i];
      const [start, end] = issue.range;

      // Skip invalid ranges or overlapping with previous
      if (start < currentIndex || start >= promptText.length || end <= start) {
        continue;
      }

      // Add preceding plain text
      if (start > currentIndex) {
        segments.push(
          <span key={`plain-${currentIndex}`} className="text-transparent">
            {promptText.substring(currentIndex, start)}
          </span>
        );
      }

      // Highlight classes based on severity
      let highlightClass = '';
      if (issue.severity === 'critical') {
        highlightClass = 'border-b-2 border-rose-500 bg-rose-500/15 decoration-wavy text-transparent cursor-pointer hover:bg-rose-500/25 transition-colors';
      } else if (issue.severity === 'important') {
        highlightClass = 'border-b-2 border-amber-500 bg-amber-500/15 decoration-wavy text-transparent cursor-pointer hover:bg-amber-500/25 transition-colors';
      } else if (issue.severity === 'style') {
        highlightClass = 'border-b-2 border-sky-500 bg-sky-500/15 decoration-wavy text-transparent cursor-pointer hover:bg-sky-500/25 transition-colors';
      } else if (issue.severity === 'good') {
        highlightClass = 'border-b-2 border-emerald-500/70 border-dashed bg-emerald-500/10 text-transparent cursor-pointer hover:bg-emerald-500/20 transition-colors';
      }

      if (selectedIssueId === issue.id) {
        highlightClass += ' ring-2 ring-indigo-500/60 ring-offset-1 rounded-sm';
      }

      segments.push(
        <mark
          key={`issue-${issue.id}`}
          onClick={() => onSelectIssue(issue.id)}
          className={`px-0.5 rounded-sm transition-all ${highlightClass}`}
          title={`${issue.message} — click to view recommendations`}
        >
          {promptText.substring(start, end)}
        </mark>
      );

      currentIndex = end;
    }

    // Trailing plain text
    if (currentIndex < promptText.length) {
      segments.push(
        <span key={`plain-end`} className="text-transparent">
          {promptText.substring(currentIndex)}
        </span>
      );
    }

    return segments;
  }, [promptText, issues, selectedIssueId, onSelectIssue]);

  // Word & character stats
  const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0;
  const charCount = promptText.length;
  const tokenEstimate = Math.ceil(charCount / 4);

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden focus-within:border-indigo-400 dark:focus-within:border-indigo-600 transition">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Prompt Canvas
          </span>

          {issues.length > 0 ? (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {issues.length} {issues.length === 1 ? 'suggestion' : 'suggestions'}
              </span>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={handlePrevIssue}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                  title="Previous suggestion (Alt+Left)"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-400 px-1 font-mono">
                  {activeIndex >= 0 ? `${activeIndex + 1}/${issues.length}` : `1/${issues.length}`}
                </span>
                <button
                  onClick={handleNextIssue}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                  title="Next suggestion (Alt+Right)"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : promptText.trim().length > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 ml-2">
              All checks passing
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {promptText.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear current prompt?')) {
                  onChange('');
                  onSelectIssue(null);
                }
              }}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
              title="Clear prompt"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!promptText.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Regional Language Detected Banner */}
      {detectedLang.isRegional && (
        <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {detectedLang.languageName}
            </span>
            <span className="text-amber-800 dark:text-amber-200 font-medium">
              Regional language detected! PromptPolish will translate and engineer your prompt into high-performing English.
            </span>
          </div>
          {onTriggerRewrite && (
            <button
              onClick={onTriggerRewrite}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-3 h-3" />
              <span>Translate & Polish to English</span>
            </button>
          )}
        </div>
      )}

      {/* Editor Main Canvas with synchronized overlay */}
      <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] p-5">
        {/* Synchronized highlight backdrop */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-5 overflow-auto pointer-events-none select-none font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words tracking-normal z-0 text-transparent"
        >
          {renderedSegments}
        </div>

        {/* Real typing textarea */}
        <textarea
          ref={textareaRef}
          value={promptText}
          onChange={e => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Type or paste your prompt here (e.g. 'write about cats' or 'explain quantum computing')..."
          className="relative w-full h-full bg-transparent text-slate-800 dark:text-slate-100 font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words tracking-normal resize-none focus:outline-none z-10 selection:bg-indigo-500/25 selection:text-indigo-900 dark:selection:text-indigo-200"
          spellCheck={true}
        />

        {/* Suggestion popover card if issue is selected */}
        {activeIssue && (
          <div className="absolute top-16 right-6 z-40 max-w-[calc(100%-2rem)]">
            <SuggestionCard
              issue={activeIssue}
              onAccept={replacement => onAcceptIssue(activeIssue, replacement)}
              onDismiss={() => {
                onDismissIssue(activeIssue.id);
                onSelectIssue(null);
              }}
              onClose={() => onSelectIssue(null)}
            />
          </div>
        )}
      </div>

      {/* Bottom stats and quick chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>•</span>
          <span>{charCount} chars</span>
          <span>•</span>
          <span>~{tokenEstimate} tokens</span>
        </div>

        {/* Color-coded legend pills */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Critical
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Important
          </span>
          <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Style
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Good
          </span>
        </div>
      </div>
    </div>
  );
};
