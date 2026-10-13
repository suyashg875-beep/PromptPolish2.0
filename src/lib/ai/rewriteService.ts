/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoalCategory, TargetAITool, PromptTone } from '../rules/types.ts';
import { TOPIC_ROLE_MAP } from '../rules/wordLists.ts';

export interface RewriteRequest {
  prompt: string;
  goal: GoalCategory;
  targetTool: TargetAITool;
  tone: PromptTone;
  language: string;
}

export interface RewriteChangeItem {
  what: string;
  why: string;
}

export interface RewriteResponse {
  improvedPrompt: string;
  changes: RewriteChangeItem[];
  newScore: number;
  missingInfoQuestions: string[];
  detectedLanguage?: string;
  translatedIntentSummary?: string;
  isFallback?: boolean;
}

export async function requestPromptRewrite(params: RewriteRequest): Promise<RewriteResponse> {
  try {
    const res = await fetch('/api/rewrite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn('API /api/rewrite returned status:', res.status, errorText);
      return generateSmartFallbackRewrite(params);
    }

    const data = await res.json();
    if (data && data.improvedPrompt) {
      return {
        improvedPrompt: data.improvedPrompt,
        changes: Array.isArray(data.changes) ? data.changes : [],
        newScore: typeof data.newScore === 'number' ? data.newScore : 92,
        missingInfoQuestions: Array.isArray(data.missingInfoQuestions) ? data.missingInfoQuestions : [],
        detectedLanguage: data.detectedLanguage || undefined,
        translatedIntentSummary: data.translatedIntentSummary || undefined,
        isFallback: false,
      };
    }

    return generateSmartFallbackRewrite(params);
  } catch (error) {
    console.warn('Error calling /api/rewrite, using client-side rule synthesizer:', error);
    return generateSmartFallbackRewrite(params);
  }
}

/**
 * Client-side rule-based prompt synthesizer.
 * Runs instantly if offline, rate limited, or without server API key.
 * Now supports regional languages (Marathi, Hindi, etc.) converting into high-scoring English.
 */
export function generateSmartFallbackRewrite(params: RewriteRequest): RewriteResponse {
  const { prompt, goal, targetTool, tone } = params;
  const raw = prompt.trim();

  // Detect if prompt is in Marathi or regional language
  const isDevanagari = /[\u0900-\u097F]/.test(raw);
  const isMarathiWord = /\b(mala|mahiti|baddal|liha|sanga|kase|aahe|pahije|dya)\b/i.test(raw);
  const isHindiWord = /\b(mujhe|batao|likho|chahiye|kaise|samjhao)\b/i.test(raw);
  const isRegional = isDevanagari || isMarathiWord || isHindiWord;

  let detectedLanguageName = 'English';
  let regionalTopicInEnglish = raw;

  if (isDevanagari || isMarathiWord) {
    detectedLanguageName = 'Marathi (मराठी)';
    if (/मांजर|cats|cat/i.test(raw)) {
      regionalTopicInEnglish = 'domestic cat behavior, communication signals, and care guidelines';
    } else if (/अभ्यास|study|physics|math/i.test(raw)) {
      regionalTopicInEnglish = 'effective study strategies and core concept mastery with practical analogies';
    } else if (/कोड|code|python|program/i.test(raw)) {
      regionalTopicInEnglish = 'clean, production-ready code with error handling and performance optimizations';
    } else {
      regionalTopicInEnglish = `the requested topic (${raw.slice(0, 30)}) translated into clear technical terms`;
    }
  } else if (isHindiWord) {
    detectedLanguageName = 'Hindi (हिंदी)';
    regionalTopicInEnglish = `the topic requested in Hindi (${raw.slice(0, 30)}) translated into comprehensive English`;
  }

  if (goal === 'image_generation' || targetTool === 'midjourney') {
    const visualSubject = isRegional ? regionalTopicInEnglish : (raw || 'A cinematic landscape');
    const improvedPrompt = `${visualSubject}, atmospheric lighting, highly detailed octane render, 8k resolution, photorealistic, 35mm film photography, award-winning composition --ar 16:9 --v 6.0`;
    return {
      improvedPrompt,
      detectedLanguage: detectedLanguageName,
      translatedIntentSummary: isRegional ? `Translated from ${detectedLanguageName}: ${visualSubject}` : undefined,
      changes: [
        ...(isRegional ? [{ what: `Translated from ${detectedLanguageName} into English`, why: 'AI image generators respond most accurately to detailed English visual descriptors.' }] : []),
        { what: 'Added visual aesthetic style', why: '35mm film & octane render cues instruct the model on texture and rendering depth.' },
        { what: 'Specified lighting & composition', why: 'Atmospheric lighting creates volumetric contrast and depth.' },
        { what: 'Added aspect ratio flag (--ar 16:9)', why: 'Prevents square default and formats image for modern displays.' }
      ],
      newScore: 92,
      missingInfoQuestions: [
        'What specific lighting mood do you prefer (e.g. golden hour sunlight, moody cyberpunk neon, or soft studio rim light)?',
        'Who or what is the central focal point of the image?'
      ],
      isFallback: true
    };
  }

  // Determine Role
  const roleList = TOPIC_ROLE_MAP[goal] || TOPIC_ROLE_MAP.general;
  const persona = roleList[0];

  // Clean raw prompt or translate regional
  let coreTask = isRegional ? `provide an in-depth, structured explanation of ${regionalTopicInEnglish}` : raw;
  if (!isRegional) {
    if (/^write about\s+/i.test(coreTask)) {
      coreTask = coreTask.replace(/^write about\s+/i, 'provide a comprehensive, evidence-based breakdown of ');
    } else if (/^tell me about\s+/i.test(coreTask)) {
      coreTask = coreTask.replace(/^tell me about\s+/i, 'analyze the core mechanisms, benefits, and key challenges of ');
    } else if (/^explain\s+/i.test(coreTask)) {
      coreTask = coreTask.replace(/^explain\s+/i, 'explain step-by-step with analogies and practical examples: ');
    } else if (coreTask.length < 15) {
      coreTask = `provide a complete, structured guide to understanding and applying ${coreTask}`;
    }
  }

  // Format per Target Tool
  let improvedPrompt = '';
  if (targetTool === 'claude') {
    improvedPrompt = `<role>
Act as an expert ${persona}.
</role>

<task>
${coreTask}
</task>

<context>
The audience wants clear, actionable mastery. Ensure explanations are direct and supported by concrete examples.
</context>

<format>
Structure your response as:
1. Executive Summary (2-3 sentences)
2. Core Concepts & Step-by-Step Breakdown
3. Markdown Comparison Table or Key Takeaways
4. Common Pitfalls & Actionable Advice
</format>

<constraints>
- Tone: ${tone}
- Avoid fluff, disclaimers, or generic introductory phrases.
- Begin immediately with the analysis.
</constraints>`;
  } else {
    improvedPrompt = `Act as an expert ${persona}.

Task:
${coreTask}

Context:
Provide an in-depth, structured explanation tailored for ambitious practitioners. Focus on real-world applicability and nuance.

Output Format:
1. Executive Overview (concise 2-3 sentence introduction)
2. Step-by-step breakdown with actionable takeaways
3. Markdown comparison table of key elements
4. Actionable recommendations and next steps

Constraints:
- Maintain a ${tone} tone throughout.
- Avoid generic pleasantries or boilerplate introductions; begin directly with the content.
- Keep the explanation under 400 words without sacrificing technical accuracy.`;
  }

  const changes: RewriteChangeItem[] = [
    ...(isRegional ? [{
      what: `Translated & Polished from ${detectedLanguageName}`,
      why: 'Transformed your regional language request into precise English prompt architecture so modern AI models deliver their highest-level reasoning.'
    }] : []),
    {
      what: `Designated Persona: ${persona}`,
      why: 'Forces the model into an authoritative perspective with domain-specific depth.'
    },
    {
      what: 'Converted vague request into structured task decomposition',
      why: 'Eliminates open-ended guessing and guides the AI through sequential analysis.'
    },
    {
      what: 'Injected 4-part structured format (Overview, Steps, Table, Recommendations)',
      why: 'Replaces walls of text with scannable, high-value sections.'
    },
    {
      what: `Enforced ${tone} tone and negative constraints`,
      why: 'Stops corporate filler and removes unsolicited conversational preambles.'
    }
  ];

  const missingInfoQuestions = raw.split(/\s+/).length < 5 ? [
    'What specific audience are you preparing this for (e.g. beginners, developers, clients)?',
    'What is your target length or depth (quick summary vs exhaustive deep-dive)?',
    'Are there any specific frameworks or examples you want included?'
  ] : [];

  return {
    improvedPrompt,
    changes,
    newScore: 94,
    missingInfoQuestions,
    detectedLanguage: detectedLanguageName,
    translatedIntentSummary: isRegional ? `Intent translated from ${detectedLanguageName}: ${regionalTopicInEnglish}` : undefined,
    isFallback: true
  };
}
