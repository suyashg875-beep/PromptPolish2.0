/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { COMMON_TYPOS } from './wordLists.ts';

export function detectSpellingGrammar(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];

  for (let i = 0; i < COMMON_TYPOS.length; i++) {
    const item = COMMON_TYPOS[i];
    item.typo.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = item.typo.exec(text)) !== null) {
      const start = match.index;
      const matchedStr = match[0];
      const end = start + matchedStr.length;

      // Handle duplicated word vs single replacement
      const isDuplicate = /^(the the|a a|in in|to to|and and)$/i.test(matchedStr);
      const replacementText = isDuplicate
        ? matchedStr.split(' ')[0]
        : item.correction;

      issues.push({
        id: `spelling-${i}-${start}`,
        category: 'spelling',
        severity: 'style', // Blue
        range: [start, end],
        highlightText: matchedStr,
        message: isDuplicate ? `Repeated word: "${matchedStr}"` : `Typo: "${matchedStr}"`,
        explanation: isDuplicate
          ? 'Accidental duplicated word detected.'
          : `Likely typo for "${replacementText}".`,
        suggestions: [
          {
            text: replacementText,
            label: `Change to "${replacementText}"`
          }
        ]
      });
    }
  }

  return issues;
}
