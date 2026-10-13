/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from '../rules/types.ts';
import {
  ROLE_PATTERNS,
  AUDIENCE_PATTERNS,
  CONTEXT_PATTERNS,
  FORMAT_PATTERNS,
  CONSTRAINTS_PATTERNS,
  EXAMPLE_PATTERNS,
  VAGUE_VERBS,
  FILLER_WORDS
} from '../rules/wordLists.ts';

export interface ScoreDimension {
  id: string;
  name: string;
  score: number; // 0-20
  maxScore: 20;
  status: 'passed' | 'warning' | 'missing';
  feedback: string;
  snippetToInsert?: string;
  label: string;
}

export interface PromptChecklistItem {
  id: string;
  dimensionId: string;
  label: string;
  description: string;
  present: boolean;
  snippetToInsert: string;
}

export interface PromptScoreResult {
  overallScore: number; // 0 - 100
  label: 'Needs work' | 'Getting there' | 'Strong' | 'Excellent';
  color: string;
  dimensions: {
    taskClarity: ScoreDimension;
    contextPurpose: ScoreDimension;
    roleAudience: ScoreDimension;
    outputFormat: ScoreDimension;
    constraintsKeywords: ScoreDimension;
  };
  checklist: PromptChecklistItem[];
  issueCounts: {
    critical: number;
    important: number;
    style: number;
    good: number;
    total: number;
  };
}

export function calculatePromptScore(
  text: string,
  issues: PromptIssue[],
  context: PromptContext
): PromptScoreResult {
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  if (wordCount === 0) {
    return createEmptyScore();
  }

  // 1. Task Clarity (0 - 20)
  // Needs clear action verb, not starting with vague verb, reasonable length
  let taskScore = 20;
  const hasVagueVerbIssue = issues.some(i => i.category === 'verb');
  const hasMissingTaskIssue = issues.some(i => i.category === 'task');
  const hasMultiTask = issues.some(i => i.category === 'multitask');

  if (hasMissingTaskIssue) taskScore -= 15;
  if (hasVagueVerbIssue) taskScore -= 6;
  if (hasMultiTask) taskScore -= 5;
  if (wordCount < 6) taskScore -= 8;
  taskScore = Math.max(0, Math.min(20, taskScore));

  // 2. Context & Purpose (0 - 20)
  let contextScore = 0;
  const hasContext = CONTEXT_PATTERNS.some(p => p.test(trimmed));
  const hasExample = EXAMPLE_PATTERNS.some(p => p.test(trimmed));
  if (hasContext) contextScore += 14;
  if (hasExample) contextScore += 6;
  if (wordCount > 25 && !hasContext) contextScore += 5; // user gave some details
  contextScore = Math.max(0, Math.min(20, contextScore));

  // 3. Role & Audience (0 - 20)
  let roleAudienceScore = 0;
  const hasRole = ROLE_PATTERNS.some(p => p.test(trimmed));
  const hasAudience = AUDIENCE_PATTERNS.some(p => p.test(trimmed));
  if (hasRole) roleAudienceScore += 11;
  if (hasAudience) roleAudienceScore += 9;
  roleAudienceScore = Math.max(0, Math.min(20, roleAudienceScore));

  // 4. Output Format (0 - 20)
  let formatScore = 0;
  const hasFormat = FORMAT_PATTERNS.some(p => p.test(trimmed));
  if (hasFormat) {
    formatScore = 20;
  } else if (context.goal === 'image_generation') {
    const hasAspect = /--ar|\d+:\d+/i.test(trimmed);
    formatScore = hasAspect ? 20 : 5;
  } else {
    formatScore = 4;
  }
  formatScore = Math.max(0, Math.min(20, formatScore));

  // 5. Keywords & Constraints (0 - 20)
  let constraintsScore = 15;
  const hasConstraints = CONSTRAINTS_PATTERNS.some(p => p.test(trimmed));
  const hasFiller = issues.some(i => i.category === 'filler');
  const hasTypos = issues.some(i => i.category === 'spelling');

  if (hasConstraints) constraintsScore += 5;
  if (hasFiller) constraintsScore -= 5;
  if (hasTypos) constraintsScore -= 4;
  constraintsScore = Math.max(0, Math.min(20, constraintsScore));

  const overallScore = Math.min(
    100,
    Math.round(taskScore + contextScore + roleAudienceScore + formatScore + constraintsScore)
  );

  let label: 'Needs work' | 'Getting there' | 'Strong' | 'Excellent';
  let color: string;

  if (overallScore >= 85) {
    label = 'Excellent';
    color = 'text-emerald-600 dark:text-emerald-400';
  } else if (overallScore >= 70) {
    label = 'Strong';
    color = 'text-blue-600 dark:text-blue-400';
  } else if (overallScore >= 45) {
    label = 'Getting there';
    color = 'text-amber-600 dark:text-amber-400';
  } else {
    label = 'Needs work';
    color = 'text-rose-600 dark:text-rose-400';
  }

  // Dimension details
  const taskDimension: ScoreDimension = {
    id: 'taskClarity',
    name: 'Task Clarity',
    score: taskScore,
    maxScore: 20,
    status: taskScore >= 16 ? 'passed' : taskScore >= 10 ? 'warning' : 'missing',
    feedback: taskScore >= 16
      ? 'Clear, actionable instruction verb.'
      : 'Use precise verbs like “analyze”, “compare”, or “draft step-by-step”.',
    snippetToInsert: 'Break down step-by-step and explain the key concepts of ',
    label: 'Actionable Verb'
  };

  const contextDimension: ScoreDimension = {
    id: 'contextPurpose',
    name: 'Context & Purpose',
    score: contextScore,
    maxScore: 20,
    status: contextScore >= 14 ? 'passed' : contextScore >= 8 ? 'warning' : 'missing',
    feedback: contextScore >= 14
      ? 'Context and objective clearly provided.'
      : 'Add “Context: [explain why you need this and your goal]”.',
    snippetToInsert: '\n\nContext: I am preparing this to help a team understand the core decisions.',
    label: 'Background Context'
  };

  const roleAudienceDimension: ScoreDimension = {
    id: 'roleAudience',
    name: 'Role & Audience',
    score: roleAudienceScore,
    maxScore: 20,
    status: roleAudienceScore >= 16 ? 'passed' : roleAudienceScore >= 9 ? 'warning' : 'missing',
    feedback: roleAudienceScore >= 16
      ? 'Target persona and audience well established.'
      : 'Add an expert persona (“Act as...”) and target audience (“For beginners...”).',
    snippetToInsert: 'Act as a Senior Domain Expert. Explain for an audience of motivated learners. ',
    label: 'Persona & Audience'
  };

  const formatDimension: ScoreDimension = {
    id: 'outputFormat',
    name: 'Output Format',
    score: formatScore,
    maxScore: 20,
    status: formatScore >= 16 ? 'passed' : 'missing',
    feedback: formatScore >= 16
      ? 'Output structure specifically defined.'
      : 'State format: bullet points, comparison table, or numbered steps.',
    snippetToInsert: '\n\nFormat the response as 5 structured bullet points with bold highlights.',
    label: 'Output Structure'
  };

  const constraintsDimension: ScoreDimension = {
    id: 'constraintsKeywords',
    name: 'Keywords & Constraints',
    score: constraintsScore,
    maxScore: 20,
    status: constraintsScore >= 15 ? 'passed' : 'warning',
    feedback: constraintsScore >= 15
      ? 'Concrete boundaries with minimal fluff.'
      : 'Add boundaries (e.g., “Keep under 200 words, no jargon”).',
    snippetToInsert: '\n\nConstraints: Keep under 250 words, avoid corporate buzzwords, and skip conversational preamble.',
    label: 'Negative Constraints'
  };

  // Checklist items
  const checklist: PromptChecklistItem[] = [
    {
      id: 'check-action-verb',
      dimensionId: 'taskClarity',
      label: 'Actionable task verb',
      description: 'Clear command such as "Analyze", "Compare", or "Draft"',
      present: !hasMissingTaskIssue && !hasVagueVerbIssue,
      snippetToInsert: 'Analyze and summarize the core principles of '
    },
    {
      id: 'check-role',
      dimensionId: 'roleAudience',
      label: 'Designated persona ("Act as...")',
      description: 'Primes AI with deep domain expertise',
      present: hasRole,
      snippetToInsert: 'Act as a Senior Subject Expert. '
    },
    {
      id: 'check-audience',
      dimensionId: 'roleAudience',
      label: 'Target audience or skill level',
      description: 'Prevents explanations from being too simple or too complex',
      present: hasAudience,
      snippetToInsert: '\nTailor this explanation for beginners with clear real-world examples.'
    },
    {
      id: 'check-format',
      dimensionId: 'outputFormat',
      label: 'Explicit output format',
      description: 'Tables, bullet lists, JSON, or step-by-step guide',
      present: hasFormat,
      snippetToInsert: '\nFormat the response as a markdown table with columns for Feature, Benefit, and Use Case.'
    },
    {
      id: 'check-context',
      dimensionId: 'contextPurpose',
      label: 'Background context / reason',
      description: 'Explains why you need this and your ultimate goal',
      present: hasContext,
      snippetToInsert: '\nContext: This will be used in an executive briefing deck.'
    },
    {
      id: 'check-constraints',
      dimensionId: 'constraintsKeywords',
      label: 'Negative constraints & length limit',
      description: 'Eliminates robotic fluff, disclaimers, or excessive length',
      present: hasConstraints,
      snippetToInsert: '\nConstraints: Maximum 200 words, no filler, start directly with the answer.'
    }
  ];

  // Count issues by severity
  const issueCounts = {
    critical: issues.filter(i => i.severity === 'critical').length,
    important: issues.filter(i => i.severity === 'important').length,
    style: issues.filter(i => i.severity === 'style').length,
    good: issues.filter(i => i.severity === 'good').length,
    total: issues.length
  };

  return {
    overallScore,
    label,
    color,
    dimensions: {
      taskClarity: taskDimension,
      contextPurpose: contextDimension,
      roleAudience: roleAudienceDimension,
      outputFormat: formatDimension,
      constraintsKeywords: constraintsDimension
    },
    checklist,
    issueCounts
  };
}

function createEmptyScore(): PromptScoreResult {
  return {
    overallScore: 0,
    label: 'Needs work',
    color: 'text-slate-400 dark:text-slate-500',
    dimensions: {
      taskClarity: {
        id: 'taskClarity',
        name: 'Task Clarity',
        score: 0,
        maxScore: 20,
        status: 'missing',
        feedback: 'Enter your prompt to evaluate task clarity.',
        label: 'Actionable Verb'
      },
      contextPurpose: {
        id: 'contextPurpose',
        name: 'Context & Purpose',
        score: 0,
        maxScore: 20,
        status: 'missing',
        feedback: 'State why you need this answer.',
        label: 'Background Context'
      },
      roleAudience: {
        id: 'roleAudience',
        name: 'Role & Audience',
        score: 0,
        maxScore: 20,
        status: 'missing',
        feedback: 'Assign a persona and target audience.',
        label: 'Persona & Audience'
      },
      outputFormat: {
        id: 'outputFormat',
        name: 'Output Format',
        score: 0,
        maxScore: 20,
        status: 'missing',
        feedback: 'Declare format (table, bullets, steps).',
        label: 'Output Structure'
      },
      constraintsKeywords: {
        id: 'constraintsKeywords',
        name: 'Keywords & Constraints',
        score: 0,
        maxScore: 20,
        status: 'missing',
        feedback: 'Set boundaries and avoid fluff.',
        label: 'Negative Constraints'
      }
    },
    checklist: [],
    issueCounts: {
      critical: 0,
      important: 0,
      style: 0,
      good: 0,
      total: 0
    }
  };
}
