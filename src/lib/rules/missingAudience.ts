/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { AUDIENCE_PATTERNS } from './wordLists.ts';

export function detectMissingAudience(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  // Don't flag super short single-word prompts (handled by missingTask/length)
  if (trimmed.length < 20) return [];

  const hasAudience = AUDIENCE_PATTERNS.some(p => p.test(trimmed));
  if (hasAudience) return [];

  // Suggest appending audience/experience level
  const lastIndex = trimmed.length;

  return [{
    id: 'missing-audience',
    category: 'audience',
    severity: 'important', // Amber
    range: [Math.max(0, lastIndex - 8), lastIndex],
    highlightText: text.substring(Math.max(0, lastIndex - 8), lastIndex),
    message: 'Missing target audience or knowledge level',
    explanation: 'Without a specified audience, the AI might explain at an inappropriate difficulty (too technical or too simplistic).',
    suggestions: [
      {
        text: `${trimmed} Tailor the explanation for beginners with no prior background.`,
        label: 'For Beginners',
        description: 'Plain English with zero assumed jargon.'
      },
      {
        text: `${trimmed} Written for busy executives who need key takeaways and metrics.`,
        label: 'For Executives',
        description: 'High-level synthesis focused on bottom-line outcomes.'
      },
      {
        text: `${trimmed} Tailored for experienced practitioners with technical depth.`,
        label: 'For Professionals',
        description: 'Advanced vocabulary, edge cases, and best practices.'
      }
    ]
  }];
}
