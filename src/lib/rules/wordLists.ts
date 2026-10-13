/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Vague verbs that lead to low-quality or generic AI responses
export const VAGUE_VERBS = [
  {
    regex: /\b(write about|write on|write me something about)\b/gi,
    replacementTemplates: [
      'Write a comprehensive guide on',
      'Explain step-by-step how to understand',
      'Summarize key arguments surrounding',
      'Compare different perspectives on'
    ],
    reason: '“Write about” is too open-ended. Tell the AI what kind of piece to write and the depth needed.'
  },
  {
    regex: /\b(tell me about|tell me everything about)\b/gi,
    replacementTemplates: [
      'Analyze the core principles of',
      'Provide an executive overview of',
      'Explain the background and key impacts of',
      'Summarize in 5 bullet points what defines'
    ],
    reason: '“Tell me about” invites long, generic overviews. Specify the depth or perspective you want.'
  },
  {
    regex: /\b(explain)\b(?!\s+(?:step\s+by\s+step|in\s+detail|simply|the\s+difference|how|why|with\s+examples))/gi,
    replacementTemplates: [
      'Explain step-by-step with analogies',
      'Compare the advantages and limitations of',
      'Explain simply for a beginner',
      'Break down the core mechanisms of'
    ],
    reason: 'Plain “explain” produces unpredictable depth. Clarify whether you want analogies, beginner terms, or technical depth.'
  },
  {
    regex: /\b(make a|make me a|do a|create a)\b(?=\s+(?:summary|list|plan|post|table|code|essay|story|email))/gi,
    replacementTemplates: [
      'Draft a detailed',
      'Generate a structured',
      'Design an actionable',
      'Outline a step-by-step'
    ],
    reason: '“Make a” is imprecise. Use specific verbs like draft, design, structure, or outline.'
  },
  {
    regex: /\b(help me with|help me)\b/gi,
    replacementTemplates: [
      'Review and give actionable feedback on',
      'Brainstorm 5 innovative ideas for',
      'Troubleshoot and identify bugs in',
      'Provide step-by-step guidance to complete'
    ],
    reason: '“Help me with” is vague. Tell the AI whether to troubleshoot, brainstorm, critique, or draft.'
  },
  {
    regex: /\b(talk about)\b/gi,
    replacementTemplates: [
      'Analyze the implications of',
      'Evaluate the key factors influencing',
      'Discuss pros and cons of'
    ],
    reason: '“Talk about” is conversational and unfocused. State the exact analytical angle you require.'
  }
];

// Filler words and weak adjectives that weaken prompt instructions
export const FILLER_WORDS = [
  {
    regex: /\b(very good|really good|super good|good)\b/gi,
    alternatives: ['high-converting', 'rigorous', 'compelling', 'effective', 'production-ready'],
    reason: '“Good” is subjective. Specify the measurable quality (e.g., “compelling”, “concise”, “rigorous”).'
  },
  {
    regex: /\b(nice)\b/gi,
    alternatives: ['polished', 'engaging', 'friendly', 'user-friendly', 'professional'],
    reason: '“Nice” leaves tone to chance. Specify if you mean engaging, polished, or friendly.'
  },
  {
    regex: /\b(stuff|things|stuff like that)\b/gi,
    alternatives: ['key elements', 'actionable steps', 'supporting evidence', 'specific details'],
    reason: '“Stuff” is ambiguous. Name the specific items, metrics, or components you need.'
  },
  {
    regex: /\b(some)\b(?=\s+(?:tips|ideas|examples|points|advice|facts))/gi,
    alternatives: ['5 actionable', '3 research-backed', 'top 10 practical', 'a prioritized list of'],
    reason: '“Some” creates random counts. Specify an exact number like “5 actionable” or “top 3”.'
  },
  {
    regex: /\b(etc\.?|and so on|and stuff)\b/gi,
    alternatives: ['including [specific item 1] and [specific item 2]', 'focusing on relevant metrics'],
    reason: 'AI tools often ignore “etc.” or guess wildly. List the exact scope or boundary.'
  },
  {
    regex: /\b(very|super|really)\b(?=\s+(?:fast|short|long|simple|smart|clean))/gi,
    alternatives: ['under 100 words', 'in 3 concise sentences', 'ultra-minimal', 'step-by-step'],
    reason: 'Intensifiers like “very” lack boundaries. Use concrete constraints (e.g., “under 100 words”).'
  }
];

// Role patterns indicating a designated persona
export const ROLE_PATTERNS = [
  /\b(act as|you are a|you are an|assume the role of|as a|behave as|take on the persona of|from the perspective of)\b/i,
  /\b(pretend you are|imagine you are)\b/i
];

// Audience / experience level patterns
export const AUDIENCE_PATTERNS = [
  /\b(for (?:beginners|experts|children|a 10-year-old|a 5-year-old|high schoolers|seniors|professionals|developers|executives|investors|students|non-technical|laymen))\b/i,
  /\b(audience is|target audience|written for|directed to|tailored for|explain to a)\b/i,
  /\b(eli5|explain like i['’]m 5)\b/i
];

// Context & purpose patterns
export const CONTEXT_PATTERNS = [
  /\b(the goal is|my goal is|i am trying to|in order to|the purpose of this is|context:|background:|the situation is|so that i can|for my)\b/i,
  /\b(i am preparing for|we are building|this is for a project|to help me decide)\b/i
];

// Format patterns
export const FORMAT_PATTERNS = [
  /\b(bullet points|bullets|numbered list|table|markdown table|step-by-step|json|csv|checklist|summary|tl;dr|essay|faq|script|email template)\b/i,
  /\b(format:|output format|in the form of|structure this as|present as a)\b/i,
  /\b(\d+\s*(?:words|sentences|paragraphs|bullet points|items|tips|steps))\b/i
];

// Constraints patterns
export const CONSTRAINTS_PATTERNS = [
  /(?:constraints?:|constraint:|\bdo not\b|\bdon['’]t\b|\bavoid\b|\bwithout\b|\blimit to\b|\bmaximum\b|\bkeep it under\b|\bstrictly\b|\bensure that\b|\bonly include\b)/i,
  /(?:tone:|\bkeep the tone\b|\bno jargon\b|\bin plain english\b|\bno fluff\b|\bcite sources\b)/i
];

// Example patterns
export const EXAMPLE_PATTERNS = [
  /\b(for example|e\.g\.|example:|like this:|such as:|here is an example|sample:)\b/i
];

// Common prompt spelling / grammar typos
export const COMMON_TYPOS = [
  { typo: /\b(the the|a a|in in|to to|and and)\b/gi, correction: 'remove duplicated word' },
  { typo: /\b(teh)\b/gi, correction: 'the' },
  { typo: /\b(recieve)\b/gi, correction: 'receive' },
  { typo: /\b(seperate)\b/gi, correction: 'separate' },
  { typo: /\b(definately)\b/gi, correction: 'definitely' },
  { typo: /\b(promt|promts)\b/gi, correction: 'prompt' },
  { typo: /\b(chat gpt|chatgtp|chatgbt)\b/gi, correction: 'ChatGPT' }
];

// Category role suggestions based on topic keywords
export const TOPIC_ROLE_MAP: Record<string, string[]> = {
  coding: ['Senior Software Architect', 'Expert Full-Stack Engineer', 'Code Reviewer & Mentor'],
  study: ['Patient Socratic Tutor', 'Professor of Applied Sciences', 'Study Coach'],
  business: ['Management Consultant', 'Startup Founder & Advisor', 'Chief Strategy Officer'],
  writing: ['Acclaimed Copywriter', 'Bestselling Book Editor', 'Creative Writing Coach'],
  marketing: ['Growth Marketing Lead', 'Direct-Response Copywriter', 'Brand Strategist'],
  research: ['Senior Academic Researcher', 'Investigative Journalist', 'Data Scientist'],
  image: ['Master Concept Artist', 'Cinematographer & Lighting Designer', '3D Stylist'],
  general: ['World-Class Subject Matter Expert', 'Senior Advisor', 'Clarifying Coach']
};
