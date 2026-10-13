/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { CONSTRAINTS_PATTERNS } from './wordLists.ts';

export function detectMissingConstraints(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (trimmed.length < 30) return [];

  const hasConstraints = CONSTRAINTS_PATTERNS.some(p => p.test(trimmed));
  if (hasConstraints) return [];

  const lastIndex = trimmed.length;

  return [{
    id: 'missing-constraints',
    category: 'constraints',
    severity: 'important', // Amber
    range: [Math.max(0, lastIndex - 4), lastIndex],
    highlightText: text.substring(Math.max(0, lastIndex - 4), lastIndex),
    message: 'Missing constraints or boundaries',
    explanation: 'Constraints prevent hallucinated fluff and limit response length. Specify what to avoid or length bounds.',
    suggestions: [
      {
        text: `${trimmed} Constraints: Keep response under 250 words, avoid corporate jargon, and focus only on actionable facts.`,
        label: 'Under 250 words & no jargon',
        description: 'Brevity and clear language constraint'
      },
      {
        text: `${trimmed} Do not include generic introductions or disclaimers; begin directly with the solution.`,
        label: 'Skip conversational intro',
        description: 'Direct answer without preamble'
      },
      {
        text: `${trimmed} Strictly cite verified sources or explicitly state assumptions.`,
        label: 'Strict accuracy & citations',
        description: 'Enforce reliability'
      }
    ]
  }];
}
