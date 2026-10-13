/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { REWRITE_SYSTEM_PROMPT } from './src/lib/ai/systemPrompt.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Request body size limit
app.use(express.json({ limit: '1mb' }));

// Simple in-memory rate limiter per IP (max 30 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count++;
  return true;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString()
  });
});

// Prompt rewrite endpoint
app.post('/api/rewrite', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before requesting another rewrite.'
    });
  }

  const { prompt, goal, targetTool, tone, language } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt text is required.' });
  }

  // Length limit (max 5,000 characters to prevent abuse)
  if (prompt.length > 5000) {
    return res.status(400).json({ error: 'Prompt exceeds the 5,000 character maximum limit.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return 503 so client gracefully falls back to client-side rule synthesizer
    return res.status(503).json({
      error: 'AI rewrite key is not configured on the server. Falling back to client-side prompt synthesis.'
    });
  }

  try {
    const ai = new GoogleGenAI({});
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let responseText = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Goal: ${goal || 'general'}\nTarget AI Tool: ${targetTool || 'chatgpt'}\nTone: ${tone || 'professional'}\nTarget Output Language: ${language || 'English'}\n\nOriginal Prompt (may be in Marathi, Hindi, or any regional/global language to translate & polish into English):\n"""\n${prompt.trim()}\n"""`
                }
              ]
            }
          ],
          config: {
            systemInstruction: REWRITE_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        });
        responseText = response.text?.trim() || '';
        if (responseText) break;
      } catch (modelErr: unknown) {
        const err = modelErr as Error;
        console.warn(`Model ${modelName} encountered error (${err?.message || err}), trying backup model...`);
      }
    }

    if (!responseText) {
      throw new Error('All candidate models returned empty responses.');
    }

    // Clean any accidental markdown wrap
    const cleanedJson = responseText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    // Validate structure
    if (!parsed.improvedPrompt) {
      throw new Error('LLM output missing improvedPrompt property');
    }

    return res.json({
      improvedPrompt: parsed.improvedPrompt,
      changes: Array.isArray(parsed.changes) ? parsed.changes : [],
      newScore: typeof parsed.newScore === 'number' ? parsed.newScore : 93,
      missingInfoQuestions: Array.isArray(parsed.missingInfoQuestions) ? parsed.missingInfoQuestions : [],
      detectedLanguage: parsed.detectedLanguage || undefined,
      translatedIntentSummary: parsed.translatedIntentSummary || undefined
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error during AI prompt rewrite:', error?.message || error);
    return res.status(500).json({
      error: 'Failed to rewrite prompt via AI service. Please try again or use the offline mode.'
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PromptPolish server running on http://0.0.0.0:${port} [env: ${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
