/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';

export interface LanguageDetectionResult {
  isRegional: boolean;
  languageCode: string; // 'mr', 'hi', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'en', 'other'
  languageName: string; // 'Marathi (मराठी)', 'Hindi (हिंदी)', etc.
  script: 'devanagari' | 'latin_romanized' | 'indic_other' | 'other_script' | 'english';
}

/**
 * Detects whether text is in a regional Indian language (Marathi, Hindi, etc.)
 * either in native Indic scripts or transliterated Roman script (e.g., Hinglish / Marathish).
 */
export function detectLanguage(text: string): LanguageDetectionResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isRegional: false, languageCode: 'en', languageName: 'English', script: 'english' };
  }

  // 1. Devanagari script detection [\u0900-\u097F]
  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount >= 3) {
    // Check Marathi specific character 'ळ' (\u0933) or specific Marathi vocabulary
    const hasMarathiUniqueChar = /[\u0933]/.test(trimmed);
    const marathiWords = /\b(मला|माहिती|बद्दल|सांगा|लिहा|करा|आहे|कसे|का|द्या|पाहिजे|तयार|समजावून|उदाहरणासह|मांजर|अभ्यास|काम|मदत|शिकवा)\b/i;
    const hindiWords = /\b(मुझे|जानकारी|बारे\s*में|बताओ|लिखो|करो|है|कैसे|क्यों|दीजिए|चाहिए|समझाओ|उदाहरण|बिल्ली|पढ़ाई|मदद)\b/i;

    const isMarathi = hasMarathiUniqueChar || marathiWords.test(trimmed);
    const isHindi = !isMarathi && hindiWords.test(trimmed);

    if (isMarathi) {
      return {
        isRegional: true,
        languageCode: 'mr',
        languageName: 'Marathi (मराठी)',
        script: 'devanagari'
      };
    }

    if (isHindi) {
      return {
        isRegional: true,
        languageCode: 'hi',
        languageName: 'Hindi (हिंदी)',
        script: 'devanagari'
      };
    }

    // General Devanagari (often Marathi or Hindi)
    return {
      isRegional: true,
      languageCode: 'mr',
      languageName: 'Marathi / Hindi (देवनागरी)',
      script: 'devanagari'
    };
  }

  // 2. Other Indic native scripts
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'bn', languageName: 'Bengali (বাংলা)', script: 'indic_other' };
  }
  if (/[\u0A80-\u0AFF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'gu', languageName: 'Gujarati (ગુજરાતી)', script: 'indic_other' };
  }
  if (/[\u0B80-\u0BFF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'ta', languageName: 'Tamil (தமிழ்)', script: 'indic_other' };
  }
  if (/[\u0C00-\u0C7F]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'te', languageName: 'Telugu (తెలుగు)', script: 'indic_other' };
  }
  if (/[\u0C80-\u0CFF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'kn', languageName: 'Kannada (ಕನ್ನಡ)', script: 'indic_other' };
  }
  if (/[\u0D00-\u0D7F]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'ml', languageName: 'Malayalam (മലയാളം)', script: 'indic_other' };
  }

  // 3. Transliterated / Romanized Regional (Latin script with Marathi / Hindi phonetic words)
  const marathiTranslit = /\b(mala|tula|mahiti|baddal|liha|sanga|kasa|kase|ahe|aahe|pahije|dya|karun|kiti|kuthe|kadhi|shikva)\b/i;
  const hindiTranslit = /\b(mujhe|batao|likho|chahiye|kaise|kyun|karein|baare\s+mein|samjhao|kijiye|madad|billi)\b/i;

  if (marathiTranslit.test(trimmed)) {
    return {
      isRegional: true,
      languageCode: 'mr',
      languageName: 'Marathi (Romanized)',
      script: 'latin_romanized'
    };
  }

  if (hindiTranslit.test(trimmed)) {
    return {
      isRegional: true,
      languageCode: 'hi',
      languageName: 'Hindi (Hinglish)',
      script: 'latin_romanized'
    };
  }

  // 4. Non-Latin foreign scripts (Arabic, CJK, Cyrillic)
  if (/[\u4E00-\u9FFF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'zh', languageName: 'Chinese (中文)', script: 'other_script' };
  }
  if (/[\u3040-\u30FF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'ja', languageName: 'Japanese (日本語)', script: 'other_script' };
  }
  if (/[\u0600-\u06FF]/.test(trimmed)) {
    return { isRegional: true, languageCode: 'ar', languageName: 'Arabic (العربية)', script: 'other_script' };
  }

  return { isRegional: false, languageCode: 'en', languageName: 'English', script: 'english' };
}

// Regional vague verb patterns for live underlines in Marathi / Hindi
const REGIONAL_VAGUE_PATTERNS = [
  {
    regex: /(?:बद्दल\s+लिहा|बद्दल\s+सांगा|माहिती\s+द्या)/gi,
    lang: 'Marathi',
    replacement: 'Provide a structured, in-depth analysis on',
    reason: '“बद्दल लिहा” किंवा “माहिती द्या” ही अतिशय सामान्य विनंती आहे. विशिष्ट स्वरूप (तक्ता किंवा मुद्दे) नमूद करा.'
  },
  {
    regex: /(?:समजावून\s+सांगा|स्पष्ट\s+करा)/gi,
    lang: 'Marathi',
    replacement: 'Explain step-by-step with real-world analogies',
    reason: 'फक्त “समजावून सांगा” ऐवजी नवशिक्यांसाठी उदाहरणांसह किंवा तांत्रिक विश्लेषण हवे आहे का ते सांगा.'
  },
  {
    regex: /(?:के\s+बारे\s+में\s+लिखो|के\s+बारे\s+में\s+बताओ|जानकारी\s+दो)/gi,
    lang: 'Hindi',
    replacement: 'Provide a comprehensive breakdown on',
    reason: '“के बारे में लिखो” बहुत व्यापक है। सटीक कार्य और प्रारूप (जैसे बुलेट पॉइंट्स या टेबल) बताएं।'
  },
  {
    regex: /(?:samjhao|batao|likho|mahiti\s+dya|baddal\s+liha)/gi,
    lang: 'Romanized',
    replacement: 'Explain step-by-step with examples',
    reason: 'Specify the exact target audience and output format in English.'
  }
];

export function detectRegionalLanguage(text: string, _context: PromptContext): PromptIssue[] {
  const issues: PromptIssue[] = [];
  const trimmed = text.trim();
  if (!trimmed) return issues;

  const detected = detectLanguage(trimmed);

  // If a regional language is detected, offer the top-level auto-translate & polish suggestion
  if (detected.isRegional) {
    issues.push({
      id: 'regional-language-detected',
      category: 'regional_language',
      severity: 'important',
      range: [0, Math.min(trimmed.length, 18)],
      highlightText: text.substring(0, Math.min(trimmed.length, 18)),
      message: `🌐 Regional Language: ${detected.languageName}`,
      explanation: `You wrote your prompt in ${detected.languageName}. Modern AI models (ChatGPT, Claude, Gemini) produce the highest quality answers when prompted in structured English. Click "Improve with AI" to translate your intent and engineer an elite English prompt.`,
      suggestions: [
        {
          text: `Translate and polish this prompt into an engineered English prompt for ${detected.languageName}`,
          label: 'Polish to English via AI',
          description: `Auto-converts your ${detected.languageName} intent into a high-scoring English prompt.`
        }
      ]
    });

    // Check for regional vague phrases in Marathi / Hindi
    for (let i = 0; i < REGIONAL_VAGUE_PATTERNS.length; i++) {
      const pattern = REGIONAL_VAGUE_PATTERNS[i];
      pattern.regex.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = pattern.regex.exec(text)) !== null) {
        const start = match.index;
        const matchedStr = match[0];
        const end = start + matchedStr.length;

        issues.push({
          id: `regional-vague-${i}-${start}`,
          category: 'verb',
          severity: 'critical',
          range: [start, end],
          highlightText: matchedStr,
          message: `Vague phrase in ${pattern.lang}: "${matchedStr}"`,
          explanation: pattern.reason,
          suggestions: [
            {
              text: pattern.replacement,
              label: `Replace with: ${pattern.replacement}`
            }
          ]
        });
      }
    }
  }

  return issues;
}
