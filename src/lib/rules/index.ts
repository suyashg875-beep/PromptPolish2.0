/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext, DetectorFn } from './types.ts';
import { detectMissingTask } from './missingTask.ts';
import { detectVagueVerbs } from './vagueVerbs.ts';
import { detectMissingRole } from './missingRole.ts';
import { detectMissingAudience } from './missingAudience.ts';
import { detectMissingContext } from './missingContext.ts';
import { detectMissingFormat } from './missingFormat.ts';
import { detectMissingConstraints } from './missingConstraints.ts';
import { detectFillerWords } from './fillerWords.ts';
import { detectLengthAndFocus } from './lengthFocus.ts';
import { detectMultiTasks } from './multiTasks.ts';
import { detectMissingExample } from './missingExample.ts';
import { detectSpellingGrammar } from './spellingGrammar.ts';
import { detectImagePromptRules } from './imagePromptRules.ts';
import { detectGoodElements } from './goodElements.ts';
import { detectRegionalLanguage, detectLanguage } from './regionalLanguage.ts';

export * from './types.ts';
export * from './wordLists.ts';
export { detectMissingTask } from './missingTask.ts';
export { detectVagueVerbs } from './vagueVerbs.ts';
export { detectMissingRole } from './missingRole.ts';
export { detectMissingAudience } from './missingAudience.ts';
export { detectMissingContext } from './missingContext.ts';
export { detectMissingFormat } from './missingFormat.ts';
export { detectMissingConstraints } from './missingConstraints.ts';
export { detectFillerWords } from './fillerWords.ts';
export { detectLengthAndFocus } from './lengthFocus.ts';
export { detectMultiTasks } from './multiTasks.ts';
export { detectMissingExample } from './missingExample.ts';
export { detectSpellingGrammar } from './spellingGrammar.ts';
export { detectImagePromptRules } from './imagePromptRules.ts';
export { detectGoodElements } from './goodElements.ts';
export { detectRegionalLanguage, detectLanguage } from './regionalLanguage.ts';

const ALL_DETECTORS: DetectorFn[] = [
  detectRegionalLanguage,
  detectMissingTask,
  detectVagueVerbs,
  detectMissingRole,
  detectMissingAudience,
  detectMissingContext,
  detectMissingFormat,
  detectMissingConstraints,
  detectFillerWords,
  detectLengthAndFocus,
  detectMultiTasks,
  detectMissingExample,
  detectSpellingGrammar,
  detectImagePromptRules,
  detectGoodElements
];

export function runAllDetectors(text: string, context: PromptContext): PromptIssue[] {
  if (!text || text.trim() === '') return [];

  const dismissed = new Set(context.dismissedIssueIds || []);
  const allIssues: PromptIssue[] = [];

  for (const detector of ALL_DETECTORS) {
    try {
      const issues = detector(text, context);
      for (const issue of issues) {
        if (!dismissed.has(issue.id)) {
          allIssues.push(issue);
        }
      }
    } catch (e) {
      console.error('Detector error:', e);
    }
  }

  // Sort by start position
  allIssues.sort((a, b) => a.range[0] - b.range[0]);

  return allIssues;
}
