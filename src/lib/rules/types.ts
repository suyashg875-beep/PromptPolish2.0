/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IssueSeverity = 'critical' | 'important' | 'style' | 'good';

export type IssueCategory =
  | 'task'
  | 'verb'
  | 'role'
  | 'audience'
  | 'context'
  | 'format'
  | 'constraints'
  | 'filler'
  | 'length'
  | 'multitask'
  | 'example'
  | 'spelling'
  | 'regional_language'
  | 'image_style'
  | 'image_lighting'
  | 'image_composition'
  | 'image_aspect_ratio';

export interface SuggestionOption {
  text: string;
  label?: string;
  description?: string;
}

export interface PromptIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  range: [number, number]; // [startIndex, endIndex] in prompt text
  highlightText: string;
  message: string; // Plain-language headline (e.g. "Vague action verb")
  explanation: string; // 1-2 sentence plain-language reason
  suggestions: SuggestionOption[];
  isGood?: boolean;
}

export type GoalCategory =
  | 'general'
  | 'study'
  | 'writing'
  | 'coding'
  | 'research'
  | 'business'
  | 'marketing'
  | 'social_media'
  | 'image_generation'
  | 'data_analysis'
  | 'everyday';

export type TargetAITool =
  | 'chatgpt'
  | 'gemini'
  | 'claude'
  | 'meta_ai'
  | 'midjourney'
  | 'deepseek'
  | 'other';

export type PromptTone =
  | 'neutral'
  | 'formal'
  | 'friendly'
  | 'professional'
  | 'simple'
  | 'direct'
  | 'academic';

export interface PromptContext {
  goal: GoalCategory;
  targetTool: TargetAITool;
  tone: PromptTone;
  language: string; // Target Output Language (default English)
  sourceLanguage?: string; // e.g. "auto", "mr", "hi", "en"
  dismissedIssueIds?: string[];
}

export type DetectorFn = (text: string, context: PromptContext) => PromptIssue[];
