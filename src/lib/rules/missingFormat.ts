/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { FORMAT_PATTERNS } from './wordLists.ts';

export function detectMissingFormat(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (trimmed.length < 20) return [];

  const hasFormat = FORMAT_PATTERNS.some(p => p.test(trimmed));
  if (hasFormat) return [];

  const lastIndex = trimmed.length;

  return [{
    id: 'missing-format',
    category: 'format',
    severity: 'important', // Amber
    range: [Math.max(0, lastIndex - 6), lastIndex],
    highlightText: text.substring(Math.max(0, lastIndex - 6), lastIndex),
    message: 'Missing desired output format',
    explanation: 'Without a declared format, the AI default is often wordy paragraphs. Ask for bullet points, a table, or steps.',
    suggestions: [
      {
        text: `${trimmed} Format the answer as 5 clear bullet points with bold takeaways.`,
        label: '5 Bullet Points',
        description: 'Structured concise takeaways'
      },
      {
        text: `${trimmed} Structure the output as a Markdown table comparing key factors.`,
        label: 'Markdown Table',
        description: 'Clean comparative layout'
      },
      {
        text: `${trimmed} Present as a numbered, step-by-step action plan.`,
        label: 'Step-by-step Plan',
        description: 'Sequential procedural steps'
      }
    ]
  }];
}
