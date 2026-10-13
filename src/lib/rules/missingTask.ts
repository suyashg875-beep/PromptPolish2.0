/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';

const ACTION_VERBS = [
  'write', 'explain', 'create', 'generate', 'analyze', 'summarize', 'compare',
  'evaluate', 'list', 'draft', 'design', 'review', 'debug', 'translate',
  'outline', 'build', 'rephrase', 'recommend', 'calculate', 'solve', 'critique',
  'develop', 'compose', 'diagnose', 'synthesize', 'extract', 'reorganize'
];

export function detectMissingTask(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 3) return [];

  // Check if there are any action verbs or task indicators
  const words = trimmed.toLowerCase().split(/\s+/);
  const hasVerb = words.some(w => {
    const cleanWord = w.replace(/[^a-z]/g, '');
    return ACTION_VERBS.includes(cleanWord);
  });

  const hasImperative = /^(give|provide|show|help|find|tell|suggest|build|make|do|how to|why is|what are|what is)\b/i.test(trimmed);

  if (!hasVerb && !hasImperative) {
    const firstWordLen = words[0]?.length || trimmed.length;
    return [{
      id: 'missing-task',
      category: 'task',
      severity: 'critical',
      range: [0, Math.min(trimmed.length, Math.max(firstWordLen, 10))],
      highlightText: text.substring(0, Math.min(trimmed.length, Math.max(firstWordLen, 10))),
      message: 'Missing clear task or action verb',
      explanation: 'Your prompt mentions a topic but doesn’t tell the AI what action to take (e.g. summarize, analyze, or compare).',
      suggestions: [
        {
          text: `Explain the fundamental concepts of ${trimmed} for beginners`,
          label: 'Explain fundamentals'
        },
        {
          text: `Compare the pros and cons of ${trimmed} in a markdown table`,
          label: 'Compare pros & cons'
        },
        {
          text: `Create a step-by-step practical guide to ${trimmed}`,
          label: 'Step-by-step guide'
        }
      ]
    }];
  }

  return [];
}
