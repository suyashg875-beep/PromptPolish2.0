/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { CONTEXT_PATTERNS } from './wordLists.ts';

export function detectMissingContext(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (trimmed.length < 25) return [];

  const hasContext = CONTEXT_PATTERNS.some(p => p.test(trimmed));
  if (hasContext) return [];

  return [{
    id: 'missing-context',
    category: 'context',
    severity: 'important', // Amber
    range: [0, Math.min(trimmed.length, 15)],
    highlightText: text.substring(0, Math.min(trimmed.length, 15)),
    message: 'Missing background context or end goal',
    explanation: 'Explaining why you need this gives the AI crucial guardrails to pick relevant details.',
    suggestions: [
      {
        text: `Context: I am preparing a project proposal. ${trimmed}`,
        label: 'Project Proposal Context',
        description: 'Frame for a business or team proposal.'
      },
      {
        text: `The goal is to study for an upcoming assessment. ${trimmed}`,
        label: 'Study Assessment Context',
        description: 'Frame for conceptual mastery.'
      },
      {
        text: `Context: We are solving a production challenge in our system. ${trimmed}`,
        label: 'Problem-Solving Context',
        description: 'Frame for practical real-world execution.'
      }
    ]
  }];
}
