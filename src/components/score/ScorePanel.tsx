/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PromptScoreResult } from '../../lib/scoring/scoreCalculator.ts';
import { PromptIssue } from '../../lib/rules/types.ts';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  Info
} from 'lucide-react';

interface ScorePanelProps {
  scoreResult: PromptScoreResult;
  issues: PromptIssue[];
  initialScore: number | null;
  onInsertSnippet: (snippet: string) => void;
  onSelectIssue: (issueId: string) => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  scoreResult,
  issues,
  initialScore,
  onInsertSnippet,
  onSelectIssue,
}) => {
  const [showAllChecklist, setShowAllChecklist] = useState(false);
  const [activeDimensionTab, setActiveDimensionTab] = useState<string | null>(null);

  const { overallScore, label, color, dimensions, checklist, issueCounts } = scoreResult;

  // Compute delta if user improved prompt
  const scoreDelta = initialScore !== null ? overallScore - initialScore : 0;

  // Determine circle circumference for animated stroke
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getScoreStrokeColor = (score: number) => {
    if (score >= 85) return 'stroke-emerald-500';
    if (score >= 70) return 'stroke-blue-500';
    if (score >= 45) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const dimensionList = [
    dimensions.taskClarity,
    dimensions.contextPurpose,
    dimensions.roleAudience,
    dimensions.outputFormat,
    dimensions.constraintsKeywords,
  ];

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      {/* Header: Score Gauge and Status Label */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Prompt Quality Score
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className={`text-xl font-bold ${color}`}>{label}</h3>
            {scoreDelta > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-3 h-3" />
                +{scoreDelta} pts
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {overallScore >= 85
              ? 'Ready for ChatGPT, Claude, and Gemini.'
              : overallScore >= 70
              ? 'Good prompt, a few minor improvements remaining.'
              : 'Add context and format to get better AI answers.'}
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={`${getScoreStrokeColor(overallScore)} transition-all duration-700 ease-out`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {overallScore}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-1">
              / 100
            </span>
          </div>
        </div>
      </div>

      {/* Issues Breakdown Badges */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Detected Elements ({issueCounts.total})
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => {
              const firstCrit = issues.find(i => i.severity === 'critical');
              if (firstCrit) onSelectIssue(firstCrit.id);
            }}
            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              issueCounts.critical > 0
                ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 hover:bg-rose-100/70'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Critical</span>
            </div>
            <span className="font-bold">{issueCounts.critical}</span>
          </div>

          <div
            onClick={() => {
              const firstImp = issues.find(i => i.severity === 'important');
              if (firstImp) onSelectIssue(firstImp.id);
            }}
            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              issueCounts.important > 0
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 hover:bg-amber-100/70'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Important</span>
            </div>
            <span className="font-bold">{issueCounts.important}</span>
          </div>

          <div
            onClick={() => {
              const firstStyle = issues.find(i => i.severity === 'style');
              if (firstStyle) onSelectIssue(firstStyle.id);
            }}
            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              issueCounts.style > 0
                ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-200 hover:bg-sky-100/70'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Style</span>
            </div>
            <span className="font-bold">{issueCounts.style}</span>
          </div>

          <div
            onClick={() => {
              const firstGood = issues.find(i => i.severity === 'good');
              if (firstGood) onSelectIssue(firstGood.id);
            }}
            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              issueCounts.good > 0
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/70'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Good</span>
            </div>
            <span className="font-bold">{issueCounts.good}</span>
          </div>
        </div>
      </div>

      {/* 5 Dimensions Progress List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>5 Dimensions (20 pts each)</span>
        </div>

        <div className="space-y-2">
          {dimensionList.map(dim => {
            const isSelected = activeDimensionTab === dim.id;
            const percentage = (dim.score / dim.maxScore) * 100;

            let barColor = 'bg-rose-500';
            if (dim.score >= 16) barColor = 'bg-emerald-500';
            else if (dim.score >= 10) barColor = 'bg-amber-500';

            return (
              <div
                key={dim.id}
                onClick={() => setActiveDimensionTab(isSelected ? null : dim.id)}
                className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {dim.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {dim.score}/20
                    </span>
                    {isSelected ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Expanded guidance details */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-xs animate-in fade-in">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                      {dim.feedback}
                    </p>
                    {dim.snippetToInsert && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (dim.snippetToInsert) onInsertSnippet(dim.snippetToInsert);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert suggested {dim.label}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Quality Checklist */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Quality Checklist
          </span>
          <button
            onClick={() => setShowAllChecklist(!showAllChecklist)}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {showAllChecklist ? 'Show Less' : 'View All'}
          </button>
        </div>

        <div className="space-y-1.5">
          {(showAllChecklist ? checklist : checklist.slice(0, 4)).map(item => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs transition group"
            >
              <div className="flex items-start gap-2 min-w-0">
                {item.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span
                    className={`font-medium block leading-tight ${
                      item.present
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {!item.present && (
                <button
                  onClick={() => onInsertSnippet(item.snippetToInsert)}
                  className="shrink-0 p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 opacity-80 group-hover:opacity-100 transition"
                  title="Insert template snippet for this item"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
