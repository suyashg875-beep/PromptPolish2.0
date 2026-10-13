# PromptPolish — The Grammarly for AI Prompts

**PromptPolish** is a fast, intelligent, real-time writing assistant for crafting world-class prompts for ChatGPT, Google Gemini, Anthropic Claude, Meta AI, and Midjourney.

Just like Grammarly catches grammatical errors as you type, PromptPolish underlines weak, vague, or missing prompt components in real time, provides instant 1-click engineering fixes, scores your prompt across 5 key dimensions (0–100), and offers an AI-powered rewrite with side-by-side diffing.

---

## Key Features

1. **Live Synchronized Underlines (Grammarly Experience)**
   - **Red (Critical):** Missing action verb, extreme vagueness (<8 words).
   - **Amber (Important):** Missing role, missing target audience, missing output structure, missing constraints.
   - **Blue (Style & Precision):** Vague verbs ("write about", "explain"), filler words ("stuff", "good", "nice", "etc."), typos.
   - **Green (Good Element):** Subtle reinforcement when high-impact roles, tables, or constraints are detected.
   - Click any underline to open a popover card with plain-language explanations and 1-click replacements.

2. **Client-Side Sub-100ms Rule Engine**
   - 12 independent, data-driven NLP detectors run completely locally in the browser with no network overhead.
   - Zero private data is transmitted while typing.

3. **5-Dimension Prompt Score (0–100)**
   - **Task Clarity (20 pts):** Clear imperative verb and focus.
   - **Context & Purpose (20 pts):** Why the request exists.
   - **Role & Audience (20 pts):** Expert persona and reader skill level.
   - **Output Format (20 pts):** Markdown tables, bullet points, step-by-step guides.
   - **Keywords & Constraints (20 pts):** Length limits, negative guidance ("avoid jargon").
   - Interactive checklist with 1-click snippet insertion.

4. **Multilingual & Regional Language Auto-Conversion (Marathi, Hindi, etc. → English)**
   - Supports native Indic scripts (Devanagari Marathi `मांजर बद्दल माहिती द्या`, Hindi, Bengali, Tamil, Telugu, etc.) as well as transliterated Roman script (`mala code pahije`, Hinglish/Marathish).
   - Detects the source language, understands the core intent, and translates/engineers it into production-ready English prompts for maximum LLM performance.
   - Shows detected language badge and translation rationale in the Before/After diff.

5. **AI Rewrite Engine (`/api/rewrite`)**
   - Deeply refactors prompts with the official `@google/genai` TypeScript SDK (using `gemini-3.8-flash` with resilient fallback to `gemini-3.1-flash-lite`).
   - Side-by-side Before/After diff view with "Why this is better" annotations.
   - Clarifying questions widget for ultra-vague prompts.
   - Resilient client-side fallback synthesizer if offline or unconfigured.

6. **Beginner Guided Builder ("Help me write it")**
   - 4-step wizard for new prompt writers to assemble high-performing prompts without technical jargon.

6. **Context Selectors & Image Prompting Mode**
   - Choose Goal, Target AI tool (Claude with XML tags, ChatGPT, Gemini, Midjourney), Tone, and Output Language.
   - Image mode checks for style, lighting, composition, and aspect ratios (`--ar 16:9`).

7. **Battle-Tested Templates & Prompting Guide**
   - Curated templates for coding architecture, Socratic study, marketing copy, executive memos, and cinematography.
   - Bad → Good real-world teardowns with instant "Load in Editor" buttons.

8. **Local History & Markdown Export**
   - Save, search, restore, and export prompt collections as `.md` or `.txt`.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Clone & Install
```bash
git clone <repo-url>
cd promptpolish
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Add your Gemini API key (optional for the rule engine, required for AI rewrite):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Unit Tests (20+ Tests)
```bash
npm test
```

---

## Deployment (Vercel & Cloud)

### Deploying to Vercel
1. Push your code to GitHub or GitLab.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variable:
   - `GEMINI_API_KEY` = your API key.
4. For Next.js/Vercel serverless functions, the `/api/rewrite` route maps directly to Vercel Serverless Edge or Node.js functions.
5. Click **Deploy**.

---

## Future Roadmap

1. **Browser Extension (Chrome / Edge / Firefox):**
   - Overlay real-time underlines directly inside the input boxes of ChatGPT, Claude, and Gemini web interfaces.
2. **Multi-Language Rule Sets:**
   - Native pattern detectors and word lists for Spanish, French, German, Japanese, and Mandarin.
3. **Team Prompt Hubs:**
   - Shared organizational prompt libraries with version control and team analytics.
4. **Few-Shot Library Integration:**
   - Auto-suggesting domain-specific few-shot examples based on detected prompt topics.
