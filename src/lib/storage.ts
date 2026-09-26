import type { GameStatus } from '../types';

export interface SavedDaily {
  wrongGuesses: string[];
  status: GameStatus;
}

const PREFIX = 'etymogle:daily:';
const STATUSES: GameStatus[] = ['playing', 'won', 'lost'];

// Storage can be unavailable (private windows, blocked site data), so every access is guarded.
export function loadDaily(dayKey: string): SavedDaily | null {
  try {
    const raw = localStorage.getItem(PREFIX + dayKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.wrongGuesses) || !STATUSES.includes(data?.status)) return null;
    return { wrongGuesses: data.wrongGuesses.map(String), status: data.status };
  } catch {
    return null;
  }
}

export function saveDaily(dayKey: string, state: SavedDaily): void {
  try {
    localStorage.setItem(PREFIX + dayKey, JSON.stringify(state));
  } catch {
    // Progress just won't survive a refresh.
  }
}
