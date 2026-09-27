import type { GameStatus } from '../types';

export interface SavedDaily {
  wrongGuesses: string[];
  status: GameStatus;
}

const PREFIX = 'etymogle:daily:';
const STATUSES: GameStatus[] = ['playing', 'won', 'lost'];

// Keyed by day and word, so a day that changes word (an override) never inherits another word's progress.
const keyFor = (dayKey: string, word: string) => `${PREFIX}${dayKey}:${word}`;

// Storage can be unavailable (private windows, blocked site data), so every access is guarded.
export function loadDaily(dayKey: string, word: string): SavedDaily | null {
  try {
    const raw = localStorage.getItem(keyFor(dayKey, word));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.wrongGuesses) || !STATUSES.includes(data?.status)) return null;
    return { wrongGuesses: data.wrongGuesses.map(String), status: data.status };
  } catch {
    return null;
  }
}

export function saveDaily(dayKey: string, word: string, state: SavedDaily): void {
  try {
    localStorage.setItem(keyFor(dayKey, word), JSON.stringify(state));
  } catch {
    // Progress just won't survive a refresh.
  }
}
