/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  runAllDetectors,
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
  detectGoodElements,
  detectRegionalLanguage,
  detectLanguage,
  PromptContext
} from '../src/lib/rules/index.ts';
import { calculatePromptScore } from '../src/lib/scoring/scoreCalculator.ts';
import { generateSmartFallbackRewrite } from '../src/lib/ai/rewriteService.ts';

const defaultContext: PromptContext = {
  goal: 'general',
  targetTool: 'chatgpt',
  tone: 'professional',
  language: 'English',
  dismissedIssueIds: []
};

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('=== RUNNING PROMPT POLISH RULE ENGINE TESTS ===\n');

// 1. Missing Task Detector
{
  const res1 = detectMissingTask('cats', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'task', 'detectMissingTask flags raw noun without verb');

  const res2 = detectMissingTask('Analyze the macroeconomic impacts of inflation', defaultContext);
  assert(res2.length === 0, 'detectMissingTask passes when valid action verb is present');
}

// 2. Vague Verbs Detector
{
  const res1 = detectVagueVerbs('write about cats in ancient egypt', defaultContext);
  assert(res1.some(i => i.highlightText.toLowerCase().includes('write about')), 'detectVagueVerbs catches "write about"');

  const res2 = detectVagueVerbs('tell me about quantum computing', defaultContext);
  assert(res2.some(i => i.highlightText.toLowerCase().includes('tell me about')), 'detectVagueVerbs catches "tell me about"');

  const res3 = detectVagueVerbs('explain the photosynthesis process', defaultContext);
  assert(res3.some(i => i.category === 'verb'), 'detectVagueVerbs catches unqualified "explain"');

  const res4 = detectVagueVerbs('help me with my python script', defaultContext);
  assert(res4.some(i => i.category === 'verb'), 'detectVagueVerbs catches "help me with"');
}

// 3. Missing Role Detector
{
  const res1 = detectMissingRole('Explain the difference between SQL and NoSQL databases for developers', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'role', 'detectMissingRole flags prompts lacking "Act as..."');

  const res2 = detectMissingRole('Act as a Senior Database Administrator. Compare PostgreSQL and MongoDB.', defaultContext);
  assert(res2.length === 0, 'detectMissingRole passes when role is declared');
}

// 4. Missing Audience Detector
{
  const res1 = detectMissingAudience('Explain how optical fiber cables transmit data at the speed of light.', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'audience', 'detectMissingAudience flags prompt without target level');

  const res2 = detectMissingAudience('Explain how optical fiber cables work for beginners with simple analogies.', defaultContext);
  assert(res2.length === 0, 'detectMissingAudience passes when "for beginners" is present');
}

// 5. Missing Context Detector
{
  const res1 = detectMissingContext('Draft a 3-bullet summary of modern clean energy innovations.', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'context', 'detectMissingContext flags prompt without context');

  const res2 = detectMissingContext('Context: I am preparing for a board meeting. Draft a summary of clean energy.', defaultContext);
  assert(res2.length === 0, 'detectMissingContext passes when "Context:" is present');
}

// 6. Missing Format Detector
{
  const res1 = detectMissingFormat('Act as an advisor. Explain best practices for quarterly financial planning.', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'format', 'detectMissingFormat flags prompt without structural format');

  const res2 = detectMissingFormat('Explain financial planning. Format your response as a markdown table.', defaultContext);
  assert(res2.length === 0, 'detectMissingFormat passes when markdown table is requested');

  const res3 = detectMissingFormat('Provide 5 bullet points summarizing quarterly earnings.', defaultContext);
  assert(res3.length === 0, 'detectMissingFormat passes with "5 bullet points" count');
}

// 7. Missing Constraints Detector
{
  const res1 = detectMissingConstraints('Act as a tutor. Explain the difference between synchronous and asynchronous JavaScript.', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'constraints', 'detectMissingConstraints flags missing bounds');

  const res2 = detectMissingConstraints('Explain async JS. Constraints: Keep under 200 words and avoid jargon.', defaultContext);
  assert(res2.length === 0, 'detectMissingConstraints passes when constraints are given');
}

// 8. Filler Words Detector
{
  const res1 = detectFillerWords('Write a very good essay with some nice stuff and things etc.', defaultContext);
  assert(res1.some(i => i.highlightText.toLowerCase().includes('good')), 'detectFillerWords catches "good"');
  assert(res1.some(i => i.highlightText.toLowerCase() === 'nice'), 'detectFillerWords catches "nice"');
  assert(res1.some(i => i.highlightText.toLowerCase() === 'stuff'), 'detectFillerWords catches "stuff"');
  assert(res1.some(i => i.highlightText.toLowerCase().includes('etc')), 'detectFillerWords catches "etc."');
}

// 9. Length & Focus Detector
{
  const res1 = detectLengthAndFocus('write about cats', defaultContext);
  assert(res1.some(i => i.id === 'too-short'), 'detectLengthAndFocus catches short prompt (<8 words)');

  const res2 = detectLengthAndFocus('Act as a Senior Economist. Analyze the long-term impacts of trade policies in a detailed structured brief.', defaultContext);
  assert(res2.length === 0, 'detectLengthAndFocus passes well-proportioned prompt');
}

// 10. Multi-Task Detector
{
  const res1 = detectMultiTasks('Write an article about gardening and also create a financial budget for seedlings and plus also make a schedule', defaultContext);
  assert(res1.length > 0 && res1[0].category === 'multitask', 'detectMultiTasks catches chained "and also create" tasks');
}

// 11. Missing Example Detector
{
  const longPromptWithoutExample = 'Act as a Senior Copywriter. Write high converting headlines for a new SaaS analytics dashboard targeting VP of Engineering. Ensure tone is confident, direct, and focused on reducing developer burnout. Keep under 10 words per headline.';
  const res1 = detectMissingExample(longPromptWithoutExample, defaultContext);
  assert(res1.length > 0 && res1[0].category === 'example', 'detectMissingExample flags long prompt lacking output samples');

  const promptWithExample = longPromptWithoutExample + ' For example: "Ship 3x Faster Without Friday Panic."';
  const res2 = detectMissingExample(promptWithExample, defaultContext);
  assert(res2.length === 0, 'detectMissingExample passes when "For example:" is included');
}

// 12. Spelling & Grammar Detector
{
  const res1 = detectSpellingGrammar('Please write the the best promt for chatgtp to recieve data', defaultContext);
  assert(res1.some(i => i.highlightText.toLowerCase() === 'the the'), 'detectSpellingGrammar catches duplicate words "the the"');
  assert(res1.some(i => i.highlightText.toLowerCase() === 'promt'), 'detectSpellingGrammar catches typo "promt"');
  assert(res1.some(i => i.highlightText.toLowerCase() === 'chatgtp'), 'detectSpellingGrammar catches typo "chatgtp"');
}

// 13. Image Prompt Detector (Midjourney / Image mode)
{
  const imageContext: PromptContext = { ...defaultContext, goal: 'image_generation', targetTool: 'midjourney' };
  const res1 = detectImagePromptRules('a cute cat sitting on a chair', imageContext);
  assert(res1.some(i => i.category === 'image_style'), 'detectImagePromptRules flags missing style');
  assert(res1.some(i => i.category === 'image_lighting'), 'detectImagePromptRules flags missing lighting');
  assert(res1.some(i => i.category === 'image_aspect_ratio'), 'detectImagePromptRules flags missing aspect ratio');

  const completeImagePrompt = 'A cute cat sitting on a vintage velvet chair, cinematic 35mm photography style, golden hour volumetric lighting, wide angle composition --ar 16:9';
  const res2 = detectImagePromptRules(completeImagePrompt, imageContext);
  assert(res2.length === 0, 'detectImagePromptRules passes comprehensive visual prompt');
}

// 14. Good Elements Detector
{
  const prompt = 'Act as a Senior Architect. Structure as a markdown table for beginners. Constraints: under 200 words.';
  const res = detectGoodElements(prompt, defaultContext);
  assert(res.some(i => i.severity === 'good' && i.category === 'role'), 'detectGoodElements detects good role');
  assert(res.some(i => i.severity === 'good' && i.category === 'format'), 'detectGoodElements detects good format');
  assert(res.some(i => i.severity === 'good' && i.category === 'constraints'), 'detectGoodElements detects good constraints');
}

// 15. Dismissal Filter Test
{
  const prompt = 'write about cats';
  const issuesAll = runAllDetectors(prompt, defaultContext);
  const dismissedContext: PromptContext = {
    ...defaultContext,
    dismissedIssueIds: [issuesAll[0]?.id].filter(Boolean)
  };
  const issuesAfterDismiss = runAllDetectors(prompt, dismissedContext);
  assert(issuesAfterDismiss.length < issuesAll.length, 'runAllDetectors respects dismissedIssueIds');
}

// 16. Score Calculation Test
{
  const badPrompt = 'write about cats';
  const badIssues = runAllDetectors(badPrompt, defaultContext);
  const badScore = calculatePromptScore(badPrompt, badIssues, defaultContext);
  assert(badScore.overallScore < 40, `calculatePromptScore flags weak prompt with low score (${badScore.overallScore}/100)`);
  assert(badScore.label === 'Needs work', 'Score label correctly set to "Needs work"');

  const strongPrompt = `Act as an expert Senior Architect.
Analyze the differences between monolithic and microservice architectures for beginners.
Context: We are deciding whether to break down our application.
Format: Provide a markdown table with Pros, Cons, and Recommended Use Case.
Constraints: Under 300 words, no corporate jargon.`;
  const strongIssues = runAllDetectors(strongPrompt, defaultContext);
  const strongScore = calculatePromptScore(strongPrompt, strongIssues, defaultContext);
  assert(strongScore.overallScore >= 85, `calculatePromptScore awards high score for complete prompt (${strongScore.overallScore}/100)`);
  assert(strongScore.label === 'Excellent', 'Score label correctly set to "Excellent"');
}

// 17. Fallback Prompt Synthesizer Test
{
  const fallback = generateSmartFallbackRewrite({
    prompt: 'explain solar energy',
    goal: 'study',
    targetTool: 'chatgpt',
    tone: 'simple',
    language: 'English'
  });
  assert(fallback.improvedPrompt.includes('Act as an expert'), 'generateSmartFallbackRewrite adds expert persona');
  assert(fallback.improvedPrompt.includes('Output Format:'), 'generateSmartFallbackRewrite adds structured format');
  assert(fallback.changes.length >= 3, 'generateSmartFallbackRewrite returns detailed change reasons');
  assert(fallback.newScore >= 90, 'generateSmartFallbackRewrite assigns high newScore');
}

// 18. Regional Language Detection & Translation Tests (Marathi, Hindi, etc.)
{
  // Test Devanagari Marathi
  const mrResult = detectLanguage('मांजर बद्दल माहिती द्या');
  assert(mrResult.isRegional === true, 'detectLanguage identifies Devanagari text as regional');
  assert(mrResult.languageCode === 'mr', 'detectLanguage detects Marathi language code');

  // Test Romanized Marathi (Marathish)
  const mrRomanResult = detectLanguage('mala cats baddal mahiti sanga');
  assert(mrRomanResult.isRegional === true, 'detectLanguage identifies Romanized Marathi (mala/baddal/mahiti)');
  assert(mrRomanResult.languageCode === 'mr', 'detectLanguage detects Romanized Marathi language code');

  // Test Hindi
  const hiResult = detectLanguage('बिल्ली के बारे में जानकारी दो');
  assert(hiResult.isRegional === true, 'detectLanguage identifies Hindi regional prompt');

  // Test English (not regional)
  const enResult = detectLanguage('Explain quantum computing for beginners');
  assert(enResult.isRegional === false, 'detectLanguage confirms English text is not regional');

  // Test detectRegionalLanguage creates issue and catches vague phrase
  const mrIssues = detectRegionalLanguage('मांजर बद्दल माहिती द्या', defaultContext);
  assert(mrIssues.some(i => i.category === 'regional_language'), 'detectRegionalLanguage creates regional language issue');
  assert(mrIssues.some(i => i.category === 'verb'), 'detectRegionalLanguage catches Marathi vague phrase "बद्दल माहिती द्या"');

  // Test Smart Fallback handles Marathi input and outputs polished English prompt
  const fallbackMarathi = generateSmartFallbackRewrite({
    prompt: 'मांजर बद्दल माहिती द्या',
    goal: 'general',
    targetTool: 'chatgpt',
    tone: 'professional',
    language: 'English'
  });
  assert(fallbackMarathi.detectedLanguage === 'Marathi (मराठी)', 'fallbackRewrite detects Marathi source language');
  assert(fallbackMarathi.improvedPrompt.includes('Act as an expert'), 'fallbackRewrite generates structured English prompt from Marathi');
  assert(fallbackMarathi.changes.some(c => c.what.includes('Marathi')), 'fallbackRewrite includes Marathi translation change item');
}

console.log(`\n=== TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED ===\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('All unit tests passed successfully!');
}

