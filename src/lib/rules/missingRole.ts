/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';
import { ROLE_PATTERNS, TOPIC_ROLE_MAP } from './wordLists.ts';

export function detectMissingRole(text: string, context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (trimmed.length < 15) return [];

  const hasRole = ROLE_PATTERNS.some(pattern => pattern.test(trimmed));
  if (hasRole) return [];

  // Determine likely topic based on text and context
  let topicKey = 'general';
  if (context.goal !== 'general' && TOPIC_ROLE_MAP[context.goal]) {
    topicKey = context.goal;
  } else if (/\b(code|react|python|javascript|api|function|database|sql|bug)\b/i.test(trimmed)) {
    topicKey = 'coding';
  } else if (/\b(study|exam|learn|history|biology|physics|math|explain)\b/i.test(trimmed)) {
    topicKey = 'study';
  } else if (/\b(market|sales|lead|campaign|seo|brand|copy)\b/i.test(trimmed)) {
    topicKey = 'marketing';
  } else if (/\b(business|pitch|investor|strategy|executive|roi)\b/i.test(trimmed)) {
    topicKey = 'business';
  } else if (/\b(story|essay|article|blog|character|plot)\b/i.test(trimmed)) {
    topicKey = 'writing';
  }

  const roleSuggestions = TOPIC_ROLE_MAP[topicKey] || TOPIC_ROLE_MAP.general;

  return [{
    id: 'missing-role',
    category: 'role',
    severity: 'important', // Amber
    range: [0, Math.min(trimmed.indexOf(' ') > 0 ? trimmed.indexOf(' ') : trimmed.length, 12)],
    highlightText: text.substring(0, Math.min(trimmed.length, 12)),
    message: 'Missing role or persona',
    explanation: 'Assigning a role (e.g. “Act as a Senior Engineer”) focuses the AI’s tone, terminology, and depth of reasoning.',
    suggestions: roleSuggestions.map(role => ({
      text: `Act as a ${role}. ${trimmed}`,
      label: `Act as ${role}`,
      description: `Prefixes your prompt with expert ${role} perspective.`
    }))
  }];
}
