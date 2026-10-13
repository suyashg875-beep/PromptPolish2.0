/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GoalCategory, TargetAITool, PromptTone } from '../../lib/rules/types.ts';
import { Sparkles, Wand2, Bot, SlidersHorizontal, Globe, Target } from 'lucide-react';

interface ContextBarProps {
  goal: GoalCategory;
  onGoalChange: (goal: GoalCategory) => void;
  targetTool: TargetAITool;
  onTargetToolChange: (tool: TargetAITool) => void;
  tone: PromptTone;
  onToneChange: (tone: PromptTone) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onOpenWizard: () => void;
  onTriggerRewrite: () => void;
  isRewriting: boolean;
  hasPromptText: boolean;
}

export const ContextBar: React.FC<ContextBarProps> = ({
  goal,
  onGoalChange,
  targetTool,
  onTargetToolChange,
  tone,
  onToneChange,
  language,
  onLanguageChange,
  onOpenWizard,
  onTriggerRewrite,
  isRewriting,
  hasPromptText
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Context Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Goal Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <label className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Goal:</label>
            <select
              value={goal}
              onChange={e => onGoalChange(e.target.value as GoalCategory)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="general">Everyday / General</option>
              <option value="study">Study & Learning</option>
              <option value="coding">Software & Code</option>
              <option value="writing">Creative Writing</option>
              <option value="business">Business Strategy</option>
              <option value="marketing">Marketing & Copy</option>
              <option value="research">Academic Research</option>
              <option value="social_media">Social Media</option>
              <option value="image_generation">Image Generation (Midjourney/DALL-E)</option>
              <option value="data_analysis">Data Analysis</option>
            </select>
          </div>

          {/* Target Model */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <Bot className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <label className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Tool:</label>
            <select
              value={targetTool}
              onChange={e => onTargetToolChange(e.target.value as TargetAITool)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="chatgpt">ChatGPT (OpenAI)</option>
              <option value="gemini">Google Gemini</option>
              <option value="claude">Anthropic Claude</option>
              <option value="meta_ai">Meta AI</option>
              <option value="midjourney">Midjourney / Image</option>
              <option value="deepseek">DeepSeek</option>
              <option value="other">Universal / Other</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <label className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Tone:</label>
            <select
              value={tone}
              onChange={e => onToneChange(e.target.value as PromptTone)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="professional">Professional</option>
              <option value="formal">Formal & Academic</option>
              <option value="friendly">Friendly & Conversational</option>
              <option value="simple">Simple (ELI5)</option>
              <option value="direct">Direct & Concise</option>
              <option value="academic">Rigorous Academic</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <label className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Output:</label>
            <select
              value={language}
              onChange={e => onLanguageChange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="English">English (Best for AI Models)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
          </div>
        </div>

        {/* Guided Wizard & AI Rewrite Buttons */}
        <div className="flex items-center gap-2">
          {/* Guided Mode */}
          <button
            onClick={onOpenWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            title="Step-by-step guided prompt builder for beginners"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Help me write it</span>
          </button>

          {/* Improve with AI Rewrite */}
          <button
            onClick={onTriggerRewrite}
            disabled={!hasPromptText || isRewriting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Translate & Polish into English (Ctrl+Enter)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRewriting ? 'animate-spin' : ''}`} />
            <span>{isRewriting ? 'Translating & Polishing...' : 'Polish Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Regional Language Support Helper Tip */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Regional Language Ready:</span>
          <span>Type in Marathi (मराठी), Hindi, or Roman script (e.g. <i>"mala cats baddal mahiti havi ahe"</i>). We auto-convert and polish it into world-class English!</span>
        </div>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Auto-translates into English</span>
      </div>
    </div>
  );
};
