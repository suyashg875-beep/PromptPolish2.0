/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoalCategory, TargetAITool, PromptTone } from '../rules/types.ts';

export interface SavedPromptItem {
  id: string;
  title: string;
  content: string;
  score: number;
  goal: GoalCategory;
  targetTool: TargetAITool;
  tone: PromptTone;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  debounceMs: number;
  highlightGoodElements: boolean;
  soundEffects: boolean;
}

const STORAGE_KEY_PROMPTS = 'promptpolish_history_v1';
const STORAGE_KEY_SETTINGS = 'promptpolish_settings_v1';

export function getSavedPrompts(): SavedPromptItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROMPTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load prompts from localStorage:', e);
    return [];
  }
}

export function savePromptToHistory(item: Omit<SavedPromptItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): SavedPromptItem {
  const existing = getSavedPrompts();
  const now = Date.now();

  const id = item.id || `prompt-${now}-${Math.random().toString(36).substring(2, 7)}`;
  const title = item.title || item.content.slice(0, 40).replace(/\n/g, ' ').trim() || 'Untitled Prompt';

  const newItem: SavedPromptItem = {
    id,
    title,
    content: item.content,
    score: item.score,
    goal: item.goal,
    targetTool: item.targetTool,
    tone: item.tone,
    createdAt: now,
    updatedAt: now,
    tags: item.tags || []
  };

  const filtered = existing.filter(p => p.id !== id);
  const updated = [newItem, ...filtered].slice(0, 50); // store up to 50 items

  try {
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save prompt to localStorage:', e);
  }

  return newItem;
}

export function deleteSavedPrompt(id: string): void {
  const existing = getSavedPrompts();
  const filtered = existing.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete prompt from localStorage:', e);
  }
}

export function clearPromptHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROMPTS);
  } catch (e) {
    console.error('Failed to clear prompt history:', e);
  }
}

export function getUserSettings(): UserSettings {
  const defaultSettings: UserSettings = {
    theme: 'system',
    debounceMs: 120,
    highlightGoodElements: true,
    soundEffects: false,
  };

  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return defaultSettings;
  }
}

export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
  return updated;
}
