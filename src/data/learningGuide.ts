/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  formula: string;
  keyRule: string;
  examples: {
    weak: string;
    strong: string;
    explanation: string;
  }[];
  proTips: string[];
}

export const PROMPT_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'task',
    title: '1. Task & Action Verb',
    subtitle: 'The steering wheel: Tell the AI exactly what operation to perform',
    iconName: 'Zap',
    formula: '[Action Verb] + [Specific Subject] + [Scope/Depth]',
    keyRule: 'Never start with "Write about" or "Tell me about". Use precise verbs: "Compare", "Audit", "Draft step-by-step", "Synthesize", or "Formulate".',
    examples: [
      {
        weak: 'Write about remote work productivity.',
        strong: 'Analyze the top 3 structural blockers to asynchronous team productivity and formulate actionable counter-measures.',
        explanation: 'The strong prompt tells the AI what to analyze (blockers) and what outcome to produce (counter-measures).'
      },
      {
        weak: 'Explain crypto.',
        strong: 'Explain how blockchain consensus mechanisms achieve Byzantine fault tolerance without a central authority.',
        explanation: 'Pinpoints the specific mechanism instead of triggering a generic 2000-word history lesson.'
      }
    ],
    proTips: [
      'Imperative mood works best: start directly with the verb.',
      'If you have multiple requests, number them sequentially or break into phases.'
    ]
  },
  {
    id: 'role-audience',
    title: '2. Role & Audience',
    subtitle: 'The persona and the reader: Frame the perspective and calibrate the vocabulary',
    iconName: 'Users',
    formula: 'Act as a [Domain Expert] for an audience of [Specific Reader Level]',
    keyRule: 'LLMs are trained on billions of diverse perspectives. Assigning a persona unlocks domain-specific reasoning and eliminates generic corporate answers.',
    examples: [
      {
        weak: 'Give me feedback on this pitch deck.',
        strong: 'Act as a Seed-stage Venture Capitalist who evaluates 50 SaaS pitches a week. Critique the market size and unit economics of this pitch.',
        explanation: 'The persona brings sharp investor skepticism rather than polite generic compliments.'
      },
      {
        weak: 'Explain asthma.',
        strong: 'Act as a Pediatric Pulmonologist. Explain pediatric asthma triggers to parents of a newly diagnosed 6-year-old child.',
        explanation: 'Calibrates the tone to be compassionate, practical, and medical without terrifying parents with cold medical jargon.'
      }
    ],
    proTips: [
      'Define their temperament: "Skeptical code reviewer", "Empathetic writing coach", or "Pragmatic CFO".',
      'Always state what the reader already knows: "Assume they know basic SQL but no cloud architectures".'
    ]
  },
  {
    id: 'context-purpose',
    title: '3. Context & End-Goal',
    subtitle: 'The background compass: Why does this output exist and how will it be used?',
    iconName: 'Compass',
    formula: 'Context: [Current Situation] + Goal: [What success looks like]',
    keyRule: 'Without context, the AI hallucinates imaginary scenarios or gives textbook definitions that do not solve your real situation.',
    examples: [
      {
        weak: 'Draft an email asking for a budget increase.',
        strong: 'Context: Our engineering team reduced incident downtime by 40% this quarter, but our cloud monitoring subscription renews in 2 weeks at a higher tier. Draft a 150-word budget request email to the VP of Finance showing immediate ROI.',
        explanation: 'Grounds the request in verifiable past wins and immediate deadline urgency.'
      }
    ],
    proTips: [
      'Mention your constraints upfront (budget, deadline, team size).',
      'Share the "why": A prompt that knows its ultimate objective gives 10x more targeted answers.'
    ]
  },
  {
    id: 'format-structure',
    title: '4. Expected Format',
    subtitle: 'The packaging: Force structured, readable, and directly usable deliverables',
    iconName: 'Layout',
    formula: 'Format: [Table / Bullet Points / JSON / Step-by-Step] + [Section Headers]',
    keyRule: 'The default AI format is long, dense, repetitive paragraphs. Force it into structured Markdown tables, checklists, or numbered actions.',
    examples: [
      {
        weak: 'Compare React and Vue.',
        strong: 'Compare React 19 and Vue 3 in a Markdown table with columns: Reactivity System, Learning Curve, Ecosystem Scale, and Ideal Project Type. Follow the table with a 2-sentence summary.',
        explanation: 'Creates a clean, scannable table rather than 8 paragraphs of text.'
      }
    ],
    proTips: [
      'Specify counts: "Provide exactly 5 bullet points with bold 3-word titles."',
      'For code or data, demand JSON schema or typed TypeScript interfaces.'
    ]
  },
  {
    id: 'constraints',
    title: '5. Boundaries & Negative Constraints',
    subtitle: 'The guardrails: Tell the AI what NOT to do',
    iconName: 'ShieldAlert',
    formula: 'Constraints: [Max length] + [Forbidden words/styles] + [Required exclusions]',
    keyRule: 'Negative guidance prevents the most annoying AI habits: chatty introductions, sycophantic praise, unnecessary disclaimers, and corporate fluff.',
    examples: [
      {
        weak: 'Write a summary of this report.',
        strong: 'Summarize the attached quarterly report in under 180 words. Constraints: No introductory greetings ("Sure, here is your summary..."), no buzzwords ("leverage", "paradigm"), and do not repeat metrics without stating their % change.',
        explanation: 'Stops robotic filler before it starts.'
      }
    ],
    proTips: [
      'Explicitly say: "Begin directly with the first point without conversational preamble."',
      'Cap word counts strictly: "Under 250 words" or "In 3 concise sentences".'
    ]
  }
];
