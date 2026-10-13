/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoalCategory, TargetAITool } from '../lib/rules/types.ts';

export interface PromptTemplate {
  id: string;
  title: string;
  category: GoalCategory;
  recommendedTool: TargetAITool;
  description: string;
  template: string;
  tags: string[];
  sampleVariables: Record<string, string>;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-code-architecture',
    title: 'Senior Architect Code Review & Refactor',
    category: 'coding',
    recommendedTool: 'claude',
    description: 'Get deep architectural critique, performance optimizations, and security auditing for your code.',
    template: `Act as a Principal Software Architect.

Task:
Review and refactor the following [Programming Language] code for [System Component]. Focus on performance, maintainability, error resilience, and edge cases.

Context:
This code handles [Traffic / Workload Context] in a production environment.

Code:
\`\`\`[Programming Language]
[Insert code here]
\`\`\`

Output Format:
1. Executive Summary & Critical Vulnerabilities
2. Refactored Code with inline explanatory comments
3. Markdown table comparing Before vs After (Time/Space complexity, readability)
4. Recommended Unit Tests for boundary conditions

Constraints:
- Follow standard idiomatic conventions for [Programming Language].
- Do not introduce external dependencies without explicit justification.`,
    tags: ['Architecture', 'Refactoring', 'Performance'],
    sampleVariables: {
      '[Programming Language]': 'TypeScript / Node.js',
      '[System Component]': 'Rate-limited payment webhook processor',
      '[Traffic / Workload Context]': '10,000 requests per minute with spike vulnerability'
    }
  },
  {
    id: 'tpl-study-feynman',
    title: 'Feynman Technique Deep Tutor',
    category: 'study',
    recommendedTool: 'gemini',
    description: 'Master any difficult concept using progressive simplification, real-world analogies, and Socratic tests.',
    template: `Act as a world-class Socratic professor using the Feynman Technique.

Task:
Explain the concept of [Complex Concept or Theory] to a beginner with zero prior background in this field.

Context:
I am studying for [Goal or Exam] and struggling with understanding why this concept matters and how its components interact.

Output Format:
1. One-Sentence Intuitive Definition
2. Plain-English Analogy from everyday life
3. Step-by-Step Breakdown of how it works
4. 3 Common Misconceptions debunked
5. Socratic Quiz: 2 challenging thought-experiment questions to test my understanding

Constraints:
- Strictly no unexplained academic jargon.
- Keep the overall explanation under 450 words.
- Wait for my answers to the quiz questions before revealing solutions.`,
    tags: ['Learning', 'Feynman', 'Tutoring'],
    sampleVariables: {
      '[Complex Concept or Theory]': 'Quantum Entanglement & Bell Inequality',
      '[Goal or Exam]': 'Undergraduate Physics Midterm'
    }
  },
  {
    id: 'tpl-business-strategy',
    title: 'Executive Strategic Memo & Decision Matrix',
    category: 'business',
    recommendedTool: 'chatgpt',
    description: 'Frame complex business choices into crisp, data-grounded trade-offs for leadership.',
    template: `Act as a Senior Management Consultant and Chief Strategy Officer.

Task:
Draft an executive strategic memorandum evaluating whether [Company Name] should [Strategic Dilemma or Decision].

Context:
Our organization is currently facing [Market Dynamic or Competitor Threat]. We need an actionable recommendation for the Board of Directors.

Output Format:
- Executive Summary (BLUF: Bottom Line Up Front)
- Problem Statement & Strategic Objective
- Option Comparison Table (Option, Upside, Downside, Capital Cost, 1-Year ROI)
- Recommended Decision & Phase-1 Action Milestones (Days 1-30, 31-90)
- Risk Mitigation Plan

Constraints:
- Tone: Formal, objective, data-driven.
- Avoid vague buzzwords; anchor reasoning in unit economics and practical constraints.
- Maximum 500 words.`,
    tags: ['Strategy', 'Executive', 'Decisions'],
    sampleVariables: {
      '[Company Name]': 'PulseFlow SaaS',
      '[Strategic Dilemma or Decision]': 'expand to enterprise sales or double down on self-serve product-led growth',
      '[Market Dynamic or Competitor Threat]': 'slowing self-serve conversion rates while average contract value is rising'
    }
  },
  {
    id: 'tpl-copy-landing-page',
    title: 'High-Converting Landing Page Copy',
    category: 'marketing',
    recommendedTool: 'chatgpt',
    description: 'Generate high-converting hero headlines, value propositions, and CTA copy using psychological persuasion.',
    template: `Act as an elite Direct-Response Copywriter who has generated millions in ARR.

Task:
Write compelling, high-converting copy for the above-the-fold hero section and features section of a landing page for [Product Name].

Target Audience:
[Specific Target Customer Profile] who are frustrated by [Current Pain Point].

Context:
Our primary conversion goal is [Free Trial Signup / Demo Booking].

Output Format:
1. Hero Section:
   - Primary Headline (punchy, under 10 words, benefit-driven)
   - Subheadline (2 sentences clarifying how it solves the pain point)
   - Primary Call To Action button text & secondary trust badge
2. 3 Core Benefit Pillars with:
   - Compelling Hook Header
   - 2-sentence micro-copy explaining the outcome
3. Social Proof snippet suggestion

Constraints:
- Focus on emotional relief and concrete transformation rather than listing dry features.
- Tone: Confident, crisp, conversational.
- No corporate clichés (e.g., "streamline", "unleash", "synergy").`,
    tags: ['Copywriting', 'Conversion', 'SaaS'],
    sampleVariables: {
      '[Product Name]': 'PulseTrace (AI automated incident postmortems)',
      '[Specific Target Customer Profile]': 'DevOps Leads and Senior Engineering Managers',
      '[Current Pain Point]': 'spending 6 painful hours writing postmortem documents after midnight outages'
    }
  },
  {
    id: 'tpl-image-cinematic',
    title: 'Cinematic Hyperrealistic Visual Scene',
    category: 'image_generation',
    recommendedTool: 'midjourney',
    description: 'Detailed photographic scene with lighting, film stock, focal length, and composition specs.',
    template: `A dramatic cinematic portrait of [Subject Description], situated in [Environment / Backdrop].

Aesthetic & Style:
Shot on 35mm Arri Alexa camera, Kodak Portra 400 film grain, cinematic color grading with warm amber highlights and deep teal shadows, hyperrealistic texture.

Lighting:
Volumetric golden hour side lighting, subtle rim light highlighting contours, soft atmospheric haze with diffused shadows.

Composition & Camera:
Wide aperture f/1.8 with shallow depth of field, creamy background bokeh, medium close-up shot, rule of thirds composition, award-winning cinematography.

Aspect Ratio:
--ar 16:9 --style raw --v 6.1`,
    tags: ['Midjourney', 'Photography', 'Cinematic'],
    sampleVariables: {
      '[Subject Description]': 'an elderly watchmaker with weathered hands inspecting intricate golden clockwork gears',
      '[Environment / Backdrop]': 'a dust-mote filled Victorian workshop with antique brass instruments'
    }
  },
  {
    id: 'tpl-research-synthesis',
    title: 'Comprehensive Research Synthesis',
    category: 'research',
    recommendedTool: 'gemini',
    description: 'Synthesize academic, scientific, or market findings with balanced counterarguments and methodology analysis.',
    template: `Act as a Senior Academic Researcher and Literature Review Specialist.

Task:
Synthesize the current empirical consensus, debates, and methodological challenges regarding [Research Topic].

Context:
I am writing a comprehensive review paper and need a balanced, objective assessment of competing perspectives.

Output Format:
1. Overview of Historical Evolution & Current Paradigm
2. Key Findings & Supporting Evidence
3. Major Academic Debates and Conflicting Studies (Present both sides)
4. Methodological Limitations & Blindspots in Current Research
5. 5 High-Impact Open Questions for Future Investigation

Constraints:
- Maintain an academic, rigorous tone.
- Clearly separate consensus facts from theoretical conjectures.
- Avoid sensationalized claims; emphasize statistical significance and reproducibility.`,
    tags: ['Research', 'Academic', 'Literature'],
    sampleVariables: {
      '[Research Topic]': 'The long-term cognitive impacts of bilingualism on executive function across age cohorts'
    }
  }
];
