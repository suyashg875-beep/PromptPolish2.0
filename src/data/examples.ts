/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BadGoodExample {
  id: string;
  category: string;
  topic: string;
  badPrompt: string;
  badScore: number;
  badFlaws: string[];
  goodPrompt: string;
  goodScore: number;
  goodWins: string[];
  whyItMatters: string;
}

export const BAD_GOOD_EXAMPLES: BadGoodExample[] = [
  {
    id: 'ex-marathi-cats',
    category: 'Regional Language (Marathi → English)',
    topic: 'मांजर बद्दल माहिती (Cat Behavior & Care Guide)',
    badPrompt: 'मांजर बद्दल माहिती द्या आणि त्यांचे वागणे समजावून सांगा',
    badScore: 22,
    badFlaws: [
      'Vague regional prompt ("माहिती द्या") lacks specific focus and depth',
      'No persona or target audience defined (too generic for practical pet care)',
      'Unstructured format leads to rambling paragraphs',
      'AI models understand regional language but generate 10x deeper answers when prompted with structured English'
    ],
    goodPrompt: `Act as a Veterinary Animal Behaviorist.

Task:
Explain the top 5 subtle body-language cues domestic cats use to communicate stress or affection, and how owners should respond to each.

Audience:
First-time cat owners looking for practical, humane care tips.

Output Format:
Present as a Markdown table with columns:
- Body Language Cue (Tail, Ears, Whiskers)
- Emotional Meaning (Stress vs Affection)
- Recommended Owner Response

Constraints:
- Keep the tone empathetic and practical.
- Keep total response under 300 words.
- Skip introductory fluff; start directly with the table.`,
    goodScore: 96,
    goodWins: [
      'Preserved the core Marathi intent ("मांजर बद्दल माहिती") and elevated into veterinary domain authority',
      'Engineered into high-impact English for maximum LLM reasoning depth',
      'Clean Markdown table replacing long text walls',
      'Explicit boundary constraints eliminating fluff'
    ],
    whyItMatters: 'Typing in your regional language (like Marathi or Hindi) shouldn’t limit your AI quality. PromptPolish translates your intent and structures an engineered English prompt that unlocks elite results from ChatGPT and Claude.'
  },
  {
    id: 'ex-cats',
    category: 'Everyday / Writing',
    topic: 'Feline behavior and cat psychology',
    badPrompt: 'write about cats',
    badScore: 18,
    badFlaws: [
      'Vague verb "write about" gives zero direction on length or angle',
      'No target audience or skill level declared',
      'Missing format (results in rambling high-school essay)',
      'No constraints or boundaries'
    ],
    goodPrompt: `Act as a Veterinary Animal Behaviorist.

Task:
Explain the top 5 subtle body-language cues domestic cats use to communicate stress or affection, and how owners should respond to each.

Audience:
First-time cat owners looking for practical, humane care tips.

Output Format:
Present as a Markdown table with columns:
- Body Language Cue (Tail, Ears, Whiskers)
- Emotional Meaning (Stress vs Affection)
- Recommended Owner Response

Constraints:
- Keep the tone empathetic and practical.
- Keep total response under 300 words.
- Skip introductory fluff; start directly with the table.`,
    goodScore: 96,
    goodWins: [
      'Specific veterinary persona established',
      'Focused task on 5 actionable body language cues',
      'Structured Markdown table layout',
      'Strict word limit and zero conversational preamble'
    ],
    whyItMatters: 'Instead of generic encyclopedia trivia about cats being mammals, the AI provides an instantly useful cheat sheet that solves a real pet owner problem.'
  },
  {
    id: 'ex-solar',
    category: 'Science / Study',
    topic: 'Solar energy technology',
    badPrompt: 'explain solar energy',
    badScore: 24,
    badFlaws: [
      'Plain "explain" produces encyclopedic summaries without depth',
      'No difficulty level specified (too simple for engineers, too dense for kids)',
      'No context or goal provided',
      'No structure or format guidance'
    ],
    goodPrompt: `Act as an MIT Renewable Energy Professor.

Task:
Explain the photovoltaic effect in solar energy cells to a 10th-grade high school physics student.

Context:
The student understands basic atomic structure (electrons and photons) but is preparing for an upcoming science fair.

Output Format:
1. The Core Idea in One Simple Analogy (e.g. pool table or game)
2. Step-by-Step Physics Mechanism (Photon absorption to electrical current)
3. 3 Key Factors that determine efficiency
4. A Quick 2-Question Quiz to check conceptual grasp

Constraints:
- Avoid graduate-level mathematics; focus on conceptual intuition.
- Maximum 400 words.`,
    goodScore: 95,
    goodWins: [
      'Exact student knowledge baseline defined (10th grade physics)',
      'Intuitive analogy requested first',
      'Clear 4-part pedagogical flow with knowledge quiz',
      'Bounded length preventing textbook dumps'
    ],
    whyItMatters: 'The AI adapts its vocabulary and analogies directly to a 10th grader, delivering deep conceptual understanding rather than boring textbook paragraphs.'
  },
  {
    id: 'ex-python',
    category: 'Coding',
    topic: 'Python Web Scraping & API',
    badPrompt: 'help me with python scraping code to get data from websites',
    badScore: 32,
    badFlaws: [
      'Vague verb "help me with"',
      'No libraries specified (BeautifulSoup vs Playwright vs Scrapy)',
      'No error handling, rate limiting, or target data types mentioned',
      'Lacks structure and format'
    ],
    goodPrompt: `Act as a Senior Python Data Engineer.

Task:
Write a clean, production-ready Python script using BeautifulSoup and requests to scrape product titles and prices from an e-commerce catalog page.

Requirements:
- Robust error handling for HTTP status codes, timeouts, and missing HTML elements.
- Custom User-Agent headers and polite rate limiting (1.5-second delays between pagination).
- Parse data into a typed pandas DataFrame and export to CSV.

Output Format:
1. Annotated Python script with inline docstrings
2. Brief explanation of edge-case handling (anti-bot headers and missing price tags)
3. Example pytest test case simulating a 404 response

Constraints:
- Adhere strictly to PEP 8 standards.
- Do not use heavyweight headless browsers (Playwright/Selenium); keep it lightweight.`,
    goodScore: 97,
    goodWins: [
      'Production requirements included (retries, User-Agent, timeouts)',
      'Explicit stack specified (BeautifulSoup + requests + pandas)',
      'Test case requested for edge cases',
      'Explicit constraint against bulky headless browser bloat'
    ],
    whyItMatters: 'Generates working, resilient code ready for production rather than a 10-line naive script that crashes on the first missing DOM element.'
  },
  {
    id: 'ex-marketing',
    category: 'Business / Marketing',
    topic: 'Email marketing launch sequence',
    badPrompt: 'write an email for our new product launch that is very good and convincing etc.',
    badScore: 28,
    badFlaws: [
      'Filler words "very good", "convincing", "etc."',
      'No product details, target customer, or offer value',
      'No call to action specified',
      'Unpredictable tone and length'
    ],
    goodPrompt: `Act as a High-Converting SaaS Copywriter.

Task:
Write an announcement email for existing free-tier users announcing the launch of our new "Team Collaboration Suite".

Audience:
Productivity-conscious solo users who have not yet upgraded to paid plans.

Key Value Proposition:
Real-time multiplayer workspaces that eliminate version-control chaos, with a limited-time 30% founding team discount for the first 48 hours.

Output Format:
- Subject Line Options (Provide 3 variations: curiosity hook, urgency hook, and benefit hook)
- Preview Text (under 80 characters)
- Body Copy (Scannable, short paragraphs, bold hooks)
- Single Call To Action button with urgency badge

Constraints:
- Tone: Friendly, celebratory, not pushy.
- Under 220 words for the body copy.
- Skip marketing jargon like "synergize" or "game-changer".`,
    goodScore: 98,
    goodWins: [
      'Eliminated vague filler words completely',
      'Clear target segment (free-tier solo users)',
      'Concrete offer (30% founding team discount, 48 hours)',
      '3 distinct subject line psychological angles provided'
    ],
    whyItMatters: 'Produces an email with high open rates and clear conversion incentives, instead of a robotic generic blast that lands in spam.'
  }
];
