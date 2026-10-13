/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { FILLER_WORDS } from './wordLists.ts';

export function detectFillerWords(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];

  for (let i = 0; i < FILLER_WORDS.length; i++) {
    const item = FILLER_WORDS[i];
    item.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = item.regex.exec(text)) !== null) {
      const start = match.index;
      const matchedStr = match[0];
      const end = start + matchedStr.length;

      issues.push({
        id: `filler-${i}-${start}`,
        category: 'filler',
        severity: 'style', // Blue
        range: [start, end],
        highlightText: matchedStr,
        message: `Vague word: "${matchedStr}"`,
        explanation: item.reason,
        suggestions: item.alternatives.map(alt => ({
          text: alt,
          label: alt,
          description: `Replace "${matchedStr}" with "${alt}"`
        }))
      });
    }
  }

  return issues;
}
