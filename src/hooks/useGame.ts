import { useState } from 'react';
import type { GameMode, GameStatus, GuessResult } from '../types';
import { getClues } from '../lib/clues';
import {
  MAX_GUESSES,
  WORDS,
  getDailyIndex,
  getRandomIndex,
  isCorrect,
  normalizeGuess,
  todayKey,
} from '../lib/puzzle';
import { loadDaily, saveDaily } from '../lib/storage';

interface GameState {
  mode: GameMode;
  /** The calendar day this daily game belongs to; used as its storage key. */
  dayKey: string;
  wordIndex: number;
  wrongGuesses: string[];
  status: GameStatus;
}

function createDailyState(): GameState {
  const dayKey = todayKey();
  const saved = loadDaily(dayKey);
  return {
    mode: 'daily',
    dayKey,
    wordIndex: getDailyIndex(),
    wrongGuesses: saved?.wrongGuesses ?? [],
    status: saved?.status ?? 'playing',
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(createDailyState);

  const entry = WORDS[state.wordIndex];
  const clues = getClues(entry);
  const wrongCount = state.wrongGuesses.length;
  const playing = state.status === 'playing';

  function update(next: GameState) {
    setState(next);
    if (next.mode === 'daily') {
      saveDaily(next.dayKey, { wrongGuesses: next.wrongGuesses, status: next.status });
    }
  }

  function submitGuess(raw: string): GuessResult {
    const guess = normalizeGuess(raw);
    if (!guess || !playing) return 'invalid';
    if (state.wrongGuesses.includes(guess)) return 'duplicate';

    if (isCorrect(guess, entry)) {
      update({ ...state, status: 'won' });
      return 'correct';
    }

    const wrongGuesses = [...state.wrongGuesses, guess];
    update({
      ...state,
      wrongGuesses,
      status: wrongGuesses.length >= MAX_GUESSES ? 'lost' : 'playing',
    });
    return 'wrong';
  }

  function startPractice() {
    setState({
      mode: 'practice',
      dayKey: todayKey(),
      wordIndex: getRandomIndex([getDailyIndex(), state.wordIndex]),
      wrongGuesses: [],
      status: 'playing',
    });
  }

  function backToDaily() {
    setState(createDailyState());
  }

  return {
    mode: state.mode,
    status: state.status,
    entry,
    clues,
    wrongGuesses: state.wrongGuesses,
    guessesUsed: wrongCount + (state.status === 'won' ? 1 : 0),
    guessNumber: Math.min(wrongCount + 1, MAX_GUESSES),
    revealedCount: playing ? Math.min(wrongCount + 1, clues.length) : clues.length,
    submitGuess,
    startPractice,
    backToDaily,
  };
}
