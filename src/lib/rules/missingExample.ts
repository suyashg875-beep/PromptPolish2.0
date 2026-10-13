/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { EXAMPLE_PATTERNS } from './wordLists.ts';

export function detectMissingExample(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  // Only suggest examples if the prompt is moderately developed (>30 words)
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 30) return [];

  const hasExample = EXAMPLE_PATTERNS.some(p => p.test(trimmed));
  if (hasExample) return [];

  const lastIndex = trimmed.length;

  return [{
    id: 'missing-example',
    category: 'example',
    severity: 'style', // Blue (style/precision)
    range: [Math.max(0, lastIndex - 4), lastIndex],
    highlightText: text.substring(Math.max(0, lastIndex - 4), lastIndex),
    message: 'Consider adding a few-shot example',
    explanation: 'Prompts with one concrete example of the desired format or output style achieve 3x higher quality responses.',
    suggestions: [
      {
        text: `${trimmed}\n\nExample of desired output format:\n[Insert 1 sample item or sentence here]`,
        label: 'Add Example Placeholder',
        description: 'Guide the model with a concrete sample.'
      }
    ]
  }];
}
