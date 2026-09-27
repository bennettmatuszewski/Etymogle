import words from '../words.json';
import type { WordEntry } from '../types';

export const MAX_GUESSES = 5;

/** Stored in place of a guess when the player skips; real guesses are never empty. */
export const SKIPPED = '';

// Skip entries whose clues haven't been generated yet (e.g. a trailing entry with no `clues`).
export const WORDS = (words as Partial<WordEntry>[]).filter(
  (entry): entry is WordEntry => Array.isArray(entry.clues) && entry.clues.length >= MAX_GUESSES,
);

const DAY_MS = 86_400_000;

const POS_LABELS: Record<string, string> = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  interj: 'interjection',
};

/** Local calendar date as YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Days pinned to a specific word (local date → word); every other day follows the rotation. */
const DAILY_OVERRIDES: Record<string, string> = {
  '2026-09-27': 'equestrian',
};

/** Same word for everyone on the same local calendar day. */
export function getDailyIndex(date = new Date()): number {
  const pinned = WORDS.findIndex((e) => e.word === DAILY_OVERRIDES[todayKey(date)]);
  if (pinned >= 0) return pinned;
  const days = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
  return days % WORDS.length;
}

export function getRandomIndex(exclude: number[] = []): number {
  const pool = WORDS.map((_, i) => i).filter((i) => !exclude.includes(i));
  return pool[Math.floor(Math.random() * pool.length)] ?? 0;
}

export function normalizeGuess(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isCorrect(guess: string, entry: WordEntry): boolean {
  return normalizeGuess(guess) === entry.word.toLowerCase();
}

export function formatPos(pos: string | null): string | null {
  if (!pos) return null;
  return POS_LABELS[pos] ?? pos;
}

export function countLetters(word: string): number {
  return word.replace(/[^\p{L}]/gu, '').length;
}

/**
 * Turns etymonline dates into plain English.
 * `label` stands alone ("late 1300s"); `phrase` follows "recorded" ("in the late 1300s").
 */
export function formatAttested(attested: string): { label: string; phrase: string } {
  const century = attested.match(/^(early |mid-|late )?(\d{1,2})c\.$/);
  if (century) {
    const label = `${century[1] ?? ''}${Number(century[2]) - 1}00s`;
    return { label, phrase: `in the ${label}` };
  }
  const circa = attested.match(/^c\. (\d{3,4})$/);
  if (circa) {
    const label = `around ${circa[1]}`;
    return { label, phrase: label };
  }
  if (/^\d{3,4}s$/.test(attested)) return { label: attested, phrase: `in the ${attested}` };
  return { label: attested, phrase: `in ${attested}` };
}
