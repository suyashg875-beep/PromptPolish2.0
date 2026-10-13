/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';

export function detectLengthAndFocus(text: string, _context: PromptContext): PromptIssue[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length < 8) {
    return [{
      id: 'too-short',
      category: 'length',
      severity: 'critical', // Red
      range: [0, trimmed.length],
      highlightText: text,
      message: 'Prompt is too short (< 8 words)',
      explanation: 'Prompts under 8 words lack essential context, instructions, and output format. The AI will likely generate a generic answer.',
      suggestions: [
        {
          text: `Explain ${trimmed} step-by-step for a beginner with real-world examples and key takeaways.`,
          label: 'Expand with structure'
        },
        {
          text: `Act as an expert tutor. Provide an in-depth breakdown of ${trimmed}, formatted as 5 concise bullet points.`,
          label: 'Add role & format'
        }
      ]
    }];
  }

  // Too long without paragraph structure or bullet points
  if (words.length > 250 && !text.includes('\n') && !text.includes('1.') && !text.includes('- ')) {
    return [{
      id: 'unfocused-length',
      category: 'length',
      severity: 'important', // Amber
      range: [0, Math.min(trimmed.length, 60)],
      highlightText: text.substring(0, Math.min(trimmed.length, 60)),
      message: 'Very long block of text without structure',
      explanation: 'Over 250 words without line breaks or headings confuses LLMs. Break this down into labeled sections (e.g., Task, Context, Constraints).',
      suggestions: [
        {
          text: `## Objective\n${text.substring(0, 100)}...\n\n## Context\n...\n\n## Constraints\n- Keep concise`,
          label: 'Organize into Markdown sections'
        }
      ]
    }];
  }

  return [];
}
