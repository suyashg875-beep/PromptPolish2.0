/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';

const MULTITASK_PATTERNS = [
  /\b(and also\s+(?:write|create|make|code|design|generate|give me))\b/gi,
  /\b(and then\s+(?:also\s+)?(?:write|create|make|code|design|generate))\b/gi,
  /\b(plus\s+(?:also\s+)?(?:make|create|write|give me|generate))\b/gi,
  /\b(as well as\s+(?:writing|creating|making|generating))\b/gi
];

export function detectMultiTasks(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];

  for (let i = 0; i < MULTITASK_PATTERNS.length; i++) {
    const pattern = MULTITASK_PATTERNS[i];
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      const start = match.index;
      const matchedStr = match[0];
      const end = start + matchedStr.length;

      issues.push({
        id: `multitask-${i}-${start}`,
        category: 'multitask',
        severity: 'important', // Amber
        range: [start, end],
        highlightText: matchedStr,
        message: 'Multiple competing tasks bundled together',
        explanation: 'Combining multiple complex requests in one prompt degrades LLM attention. Split them into numbered phases or separate prompts.',
        suggestions: [
          {
            text: '\n\nPhase 1: [First task]\nPhase 2: [Second task]',
            label: 'Separate into Phase 1 & 2',
            description: 'Order sequentially so the model addresses each one systematically.'
          },
          {
            text: 'First complete this task. Once approved, I will prompt you for the next step.',
            label: 'Chain into two prompts',
            description: 'Best practice: execute in two separate turns.'
          }
        ]
      });
    }
  }

  return issues;
}
