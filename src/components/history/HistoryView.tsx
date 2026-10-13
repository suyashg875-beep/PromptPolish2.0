/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  SavedPromptItem,
  getSavedPrompts,
  deleteSavedPrompt,
  clearPromptHistory
} from '../../lib/storage/storageService.ts';
import {
  History,
  Search,
  Trash2,
  Copy,
  Check,
  FileDown,
  ArrowRight,
  Calendar,
  Sparkles,
  Bot
} from 'lucide-react';

interface HistoryViewProps {
  onLoadPrompt: (promptText: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onLoadPrompt }) => {
  const [prompts, setPrompts] = useState<SavedPromptItem[]>(() => getSavedPrompts());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = prompts.filter(p => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.goal.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedPrompt(id);
    setPrompts(getSavedPrompts());
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all saved prompt history from your local browser storage?')) {
      clearPromptHistory();
      setPrompts([]);
    }
  };

  const handleCopy = async (content: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (format: 'txt' | 'md') => {
    if (prompts.length === 0) return;

    let content = '';
    if (format === 'md') {
      content = `# PromptPolish Saved Prompts Export\nExported on: ${new Date().toLocaleString()}\n\n`;
      prompts.forEach((p, idx) => {
        content += `## ${idx + 1}. ${p.title} (${p.score}/100)\n`;
        content += `- **Goal:** ${p.goal} | **Tool:** ${p.targetTool} | **Tone:** ${p.tone}\n`;
        content += `- **Date:** ${new Date(p.createdAt).toLocaleDateString()}\n\n`;
        content += `\`\`\`\n${p.content}\n\`\`\`\n\n---\n\n`;
      });
    } else {
      content = `PROMPT POLISH EXPORT (${new Date().toLocaleString()})\n\n`;
      prompts.forEach((p, idx) => {
        content += `=========================================\n`;
        content += `${idx + 1}. ${p.title} [Score: ${p.score}/100]\n`;
        content += `Date: ${new Date(p.createdAt).toLocaleDateString()}\n`;
        content += `Goal: ${p.goal} | Tool: ${p.targetTool}\n`;
        content += `-----------------------------------------\n`;
        content += `${p.content}\n\n`;
      });
    }

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptpolish-export-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" />
            <span>Prompt History</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Locally stored in your browser. Never transmitted without your action.
          </p>
        </div>

        {prompts.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('md')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              onClick={() => handleExport('txt')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export .txt</span>
            </button>

            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      {prompts.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved prompts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      )}

      {/* Prompts List */}
      {prompts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No Saved Prompts Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Prompts you craft and improve in the editor are automatically saved here so you can revisit and reuse them anytime.
          </p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-500">
          No prompts matched your search query "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrompts.map(item => (
            <div
              key={item.id}
              onClick={() => onLoadPrompt(item.content)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate max-w-md">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.score}/100
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    {item.targetTool}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-2xl">
                  {item.content.replace(/\n/g, ' ')}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={e => handleCopy(item.content, item.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Copy to clipboard"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={e => handleDelete(item.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1 pl-2">
                  <span>Reopen</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
