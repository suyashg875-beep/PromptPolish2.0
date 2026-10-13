/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  PromptIssue,
  PromptContext,
  GoalCategory,
  TargetAITool,
  PromptTone,
  runAllDetectors
} from './lib/rules/index.ts';
import { calculatePromptScore, PromptScoreResult } from './lib/scoring/scoreCalculator.ts';
import { requestPromptRewrite, RewriteResponse } from './lib/ai/rewriteService.ts';
import { savePromptToHistory, getUserSettings, saveUserSettings } from './lib/storage/storageService.ts';
import { Navbar, NavTab } from './components/Navbar.tsx';
import { ContextBar } from './components/editor/ContextBar.tsx';
import { PromptEditor } from './components/editor/PromptEditor.tsx';
import { ScorePanel } from './components/score/ScorePanel.tsx';
import { DiffModal } from './components/rewrite/DiffModal.tsx';
import { PromptWizardModal } from './components/wizard/PromptWizardModal.tsx';
import { TemplatesView } from './components/templates/TemplatesView.tsx';
import { LearnView } from './components/learn/LearnView.tsx';
import { HistoryView } from './components/history/HistoryView.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { AboutModal } from './components/modals/AboutModal.tsx';
import { ShortcutsModal } from './components/modals/ShortcutsModal.tsx';
import { PromptTemplate } from './data/templates.ts';

const DEFAULT_DEMO_PROMPT = 'write about cats';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('editor');
  const [promptText, setPromptText] = useState<string>(DEFAULT_DEMO_PROMPT);
  const [goal, setGoal] = useState<GoalCategory>('general');
  const [targetTool, setTargetTool] = useState<TargetAITool>('chatgpt');
  const [tone, setTone] = useState<PromptTone>('professional');
  const [language, setLanguage] = useState<string>('English');
  const [dismissedIssueIds, setDismissedIssueIds] = useState<string[]>([]);

  // Focus & selection state
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Score tracking
  const [initialScore, setInitialScore] = useState<number | null>(null);

  // Modals state
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<RewriteResponse | null>(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = getUserSettings();
      if (saved.theme === 'dark') return true;
      if (saved.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveUserSettings({ theme: isDark ? 'dark' : 'light' });
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Prompt Context
  const context: PromptContext = useMemo(() => ({
    goal,
    targetTool,
    tone,
    language,
    dismissedIssueIds
  }), [goal, targetTool, tone, language, dismissedIssueIds]);

  // Live Rule Engine (debounced < 100ms)
  const [debouncedText, setDebouncedText] = useState(promptText);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(promptText);
    }, 70);
    return () => clearTimeout(timer);
  }, [promptText]);

  const issues = useMemo(() => {
    return runAllDetectors(debouncedText, context);
  }, [debouncedText, context]);

  const scoreResult: PromptScoreResult = useMemo(() => {
    return calculatePromptScore(debouncedText, issues, context);
  }, [debouncedText, issues, context]);

  // Track initial baseline score once
  useEffect(() => {
    if (initialScore === null && scoreResult.overallScore > 0) {
      setInitialScore(scoreResult.overallScore);
    }
  }, [scoreResult.overallScore, initialScore]);

  // Handle accepting an issue fix
  const handleAcceptIssue = useCallback((issue: PromptIssue, replacementText: string) => {
    const [start, end] = issue.range;
    if (start >= 0 && end <= promptText.length) {
      const before = promptText.substring(0, start);
      const after = promptText.substring(end);
      const updated = before + replacementText + after;
      setPromptText(updated);
      setSelectedIssueId(null);
    }
  }, [promptText]);

  // Handle dismissing an issue
  const handleDismissIssue = useCallback((issueId: string) => {
    setDismissedIssueIds(prev => [...prev, issueId]);
    if (selectedIssueId === issueId) {
      setSelectedIssueId(null);
    }
  }, [selectedIssueId]);

  // Handle inserting snippet from checklist or dimensions
  const handleInsertSnippet = useCallback((snippet: string) => {
    setPromptText(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return snippet.trim();
      return trimmed + snippet;
    });
  }, []);

  // Trigger AI Rewrite
  const handleTriggerRewrite = useCallback(async () => {
    if (!promptText.trim() || isRewriting) return;
    setIsRewriting(true);

    try {
      const result = await requestPromptRewrite({
        prompt: promptText,
        goal,
        targetTool,
        tone,
        language
      });
      setRewriteResult(result);
      setIsDiffModalOpen(true);

      // Autosave to history
      savePromptToHistory({
        title: promptText.slice(0, 35).replace(/\n/g, ' ') || 'Polished Prompt',
        content: result.improvedPrompt,
        score: result.newScore,
        goal,
        targetTool,
        tone
      });
    } catch (err) {
      console.error('Rewrite failed:', err);
    } finally {
      setIsRewriting(false);
    }
  }, [promptText, goal, targetTool, tone, language, isRewriting]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: Trigger AI Rewrite
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTriggerRewrite();
      }
      // Alt + ArrowRight: Next issue
      else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (issues.length > 0) {
          const currIdx = issues.findIndex(i => i.id === selectedIssueId);
          const nextIdx = (currIdx + 1) % issues.length;
          setSelectedIssueId(issues[nextIdx].id);
        }
      }
      // Alt + ArrowLeft: Prev issue
      else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (issues.length > 0) {
          const currIdx = issues.findIndex(i => i.id === selectedIssueId);
          const prevIdx = (currIdx - 1 + issues.length) % issues.length;
          setSelectedIssueId(issues[prevIdx].id);
        }
      }
      // Escape: Close card or modal
      else if (e.key === 'Escape') {
        if (selectedIssueId) setSelectedIssueId(null);
        if (isDiffModalOpen) setIsDiffModalOpen(false);
        if (isWizardOpen) setIsWizardOpen(false);
        if (isAboutOpen) setIsAboutOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleTriggerRewrite,
    issues,
    selectedIssueId,
    isDiffModalOpen,
    isWizardOpen,
    isAboutOpen,
    isShortcutsOpen
  ]);

  // Load template into editor
  const handleSelectTemplate = (template: PromptTemplate) => {
    setPromptText(template.template);
    setGoal(template.category);
    setTargetTool(template.recommendedTool);
    setDismissedIssueIds([]);
    setInitialScore(null);
    setActiveTab('editor');
  };

  // Load arbitrary prompt into editor
  const handleLoadPrompt = (newPromptText: string) => {
    setPromptText(newPromptText);
    setDismissedIssueIds([]);
    setInitialScore(null);
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-700 dark:selection:text-indigo-300">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNewPrompt={() => {
          setPromptText('');
          setSelectedIssueId(null);
          setDismissedIssueIds([]);
          setInitialScore(null);
          setActiveTab('editor');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'landing' && (
          <LandingPage
            onStartEditor={promptToLoad => {
              if (promptToLoad) setPromptText(promptToLoad);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView onSelectTemplate={handleSelectTemplate} />
        )}

        {activeTab === 'learn' && (
          <LearnView onLoadPrompt={handleLoadPrompt} />
        )}

        {activeTab === 'history' && (
          <HistoryView onLoadPrompt={handleLoadPrompt} />
        )}

        {activeTab === 'editor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-in fade-in">
            {/* Context bar (Goal, Tool, Tone, Language, Wizard, AI Rewrite) */}
            <ContextBar
              goal={goal}
              onGoalChange={g => {
                setGoal(g);
                if (g === 'image_generation') setTargetTool('midjourney');
              }}
              targetTool={targetTool}
              onTargetToolChange={setTargetTool}
              tone={tone}
              onToneChange={setTone}
              language={language}
              onLanguageChange={setLanguage}
              onOpenWizard={() => setIsWizardOpen(true)}
              onTriggerRewrite={handleTriggerRewrite}
              isRewriting={isRewriting}
              hasPromptText={Boolean(promptText.trim())}
            />

            {/* Split Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Live Synchronized Prompt Editor */}
              <div className="lg:col-span-8 flex flex-col h-[520px] sm:h-[620px]">
                <PromptEditor
                  promptText={promptText}
                  onChange={setPromptText}
                  issues={issues}
                  onAcceptIssue={handleAcceptIssue}
                  onDismissIssue={handleDismissIssue}
                  selectedIssueId={selectedIssueId}
                  onSelectIssue={setSelectedIssueId}
                  onTriggerRewrite={handleTriggerRewrite}
                />
              </div>

              {/* Right Column: 5-Dimension Score & Live Checklist Panel */}
              <div className="lg:col-span-4">
                <ScorePanel
                  scoreResult={scoreResult}
                  issues={issues}
                  initialScore={initialScore}
                  onInsertSnippet={handleInsertSnippet}
                  onSelectIssue={setSelectedIssueId}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">PromptPolish</span>
            <span>— The Grammarly for AI Prompts.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Privacy Guarantee
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Shortcuts
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Prompt Guide
            </button>
          </div>
        </div>
      </footer>

      {/* AI Rewrite Diff Modal */}
      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        originalPrompt={promptText}
        originalScore={scoreResult.overallScore}
        rewriteResult={rewriteResult}
        onApplyImproved={newPrompt => {
          setPromptText(newPrompt);
          setDismissedIssueIds([]);
          setInitialScore(scoreResult.overallScore);
        }}
      />

      {/* Guided Builder Wizard Modal */}
      <PromptWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyPrompt={assembledPrompt => {
          setPromptText(assembledPrompt);
          setDismissedIssueIds([]);
          setInitialScore(null);
        }}
      />

      {/* About & Privacy Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
