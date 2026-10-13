/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { ROLE_PATTERNS, FORMAT_PATTERNS, AUDIENCE_PATTERNS, CONSTRAINTS_PATTERNS } from './wordLists.ts';

export function detectGoodElements(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 10) return [];

  // Check for good role definition
  for (const pattern of ROLE_PATTERNS) {
    const match = pattern.exec(text);
    if (match) {
      issues.push({
        id: `good-role-${match.index}`,
        category: 'role',
        severity: 'good', // Green
        range: [match.index, match.index + match[0].length],
        highlightText: match[0],
        message: 'Great: Clear persona assigned',
        explanation: 'Assigning a distinct persona primes the AI with specific domain knowledge and tone.',
        suggestions: [],
        isGood: true
      });
      break;
    }
  }

  // Check for clear output format
  for (const pattern of FORMAT_PATTERNS) {
    const match = pattern.exec(text);
    if (match) {
      issues.push({
        id: `good-format-${match.index}`,
        category: 'format',
        severity: 'good', // Green
        range: [match.index, match.index + match[0].length],
        highlightText: match[0],
        message: 'Great: Stated output format',
        explanation: 'Specifying format (lists, tables, steps) forces the AI into structured, readable responses.',
        suggestions: [],
        isGood: true
      });
      break;
    }
  }

  // Check for audience
  for (const pattern of AUDIENCE_PATTERNS) {
    const match = pattern.exec(text);
    if (match) {
      issues.push({
        id: `good-audience-${match.index}`,
        category: 'audience',
        severity: 'good', // Green
        range: [match.index, match.index + match[0].length],
        highlightText: match[0],
        message: 'Great: Explicit audience level',
        explanation: 'Stating the audience anchors the difficulty and vocabulary at the exact right depth.',
        suggestions: [],
        isGood: true
      });
      break;
    }
  }

  // Check for negative constraints
  for (const pattern of CONSTRAINTS_PATTERNS) {
    const match = pattern.exec(text);
    if (match) {
      issues.push({
        id: `good-constraints-${match.index}`,
        category: 'constraints',
        severity: 'good', // Green
        range: [match.index, match.index + match[0].length],
        highlightText: match[0],
        message: 'Great: Clear constraints applied',
        explanation: 'Boundaries and negative constraints prevent verbosity, hallucinations, and unwanted fluff.',
        suggestions: [],
        isGood: true
      });
      break;
    }
  }

  return issues;
}
