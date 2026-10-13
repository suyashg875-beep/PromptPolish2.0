/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { VAGUE_VERBS } from './wordLists.ts';

export function detectVagueVerbs(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];

  for (let ruleIndex = 0; ruleIndex < VAGUE_VERBS.length; ruleIndex++) {
    const rule = VAGUE_VERBS[ruleIndex];
    // Reset regex lastIndex
    rule.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.regex.exec(text)) !== null) {
      const start = match.index;
      const matchedStr = match[0];
      const end = start + matchedStr.length;

      // Extract remaining sentence context after the matched verb if possible
      const restOfSentence = text.substring(end).split(/[.?!;\n]/)[0]?.trim() || '';

      const suggestions = rule.replacementTemplates.map(tpl => ({
        text: restOfSentence ? `${tpl} ${restOfSentence}` : tpl,
        label: tpl.split(' ').slice(0, 3).join(' ') + '...',
        description: tpl
      }));

      // If it's "write about" at the start, it's critical/red. Others are blue (style/precision).
      const isCritical = /write about|tell me about/i.test(matchedStr);

      issues.push({
        id: `vague-verb-${ruleIndex}-${start}`,
        category: 'verb',
        severity: isCritical ? 'critical' : 'style',
        range: [start, end],
        highlightText: matchedStr,
        message: `Vague verb: "${matchedStr}"`,
        explanation: rule.reason,
        suggestions
      });
    }
  }

  return issues;
}
