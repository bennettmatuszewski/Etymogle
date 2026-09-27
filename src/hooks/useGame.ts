import { useState } from 'react';
import type { GameMode, GameStatus, GuessResult } from '../types';
import { getClues } from '../lib/clues';
import {
  MAX_GUESSES,
  SKIPPED,
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
  /** The calendar day this daily game belongs to; with the word, its storage key. */
  dayKey: string;
  wordIndex: number;
  /** Wrong guesses in order; a skip is stored as `SKIPPED`. */
  wrongGuesses: string[];
  status: GameStatus;
}

function createDailyState(): GameState {
  const dayKey = todayKey();
  const wordIndex = getDailyIndex();
  const saved = loadDaily(dayKey, WORDS[wordIndex].word);
  return {
    mode: 'daily',
    dayKey,
    wordIndex,
    wrongGuesses: saved?.wrongGuesses ?? [],
    status: saved?.status ?? 'playing',
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(createDailyState);
  // True only for a win that happened in this session, so reloading a solved daily doesn't re-celebrate.
  const [justWon, setJustWon] = useState(false);

  const entry = WORDS[state.wordIndex];
  const clues = getClues(entry);
  const wrongCount = state.wrongGuesses.length;
  const playing = state.status === 'playing';
  // One clue to start, plus one per miss.
  const unlockedCount = Math.min(wrongCount + 1, clues.length);

  function update(next: GameState) {
    setState(next);
    if (next.mode === 'daily') {
      saveDaily(next.dayKey, WORDS[next.wordIndex].word, { wrongGuesses: next.wrongGuesses, status: next.status });
    }
  }

  function submitGuess(raw: string): GuessResult {
    const guess = normalizeGuess(raw);
    if (!guess || !playing) return 'invalid';
    if (state.wrongGuesses.includes(guess)) return 'duplicate';

    if (isCorrect(guess, entry)) {
      update({ ...state, status: 'won' });
      setJustWon(true);
      return 'correct';
    }

    addMiss(guess);
    return 'wrong';
  }

  /** Uses up a guess without guessing, revealing the next clue. */
  function skipGuess() {
    if (playing) addMiss(SKIPPED);
  }

  function addMiss(guess: string) {
    const wrongGuesses = [...state.wrongGuesses, guess];
    update({
      ...state,
      wrongGuesses,
      status: wrongGuesses.length >= MAX_GUESSES ? 'lost' : 'playing',
    });
  }

  function startPractice() {
    setJustWon(false);
    setState({
      mode: 'practice',
      dayKey: todayKey(),
      wordIndex: getRandomIndex([getDailyIndex(), state.wordIndex]),
      wrongGuesses: [],
      status: 'playing',
    });
  }

  function backToDaily() {
    setJustWon(false);
    setState(createDailyState());
  }

  return {
    mode: state.mode,
    status: state.status,
    justWon,
    entry,
    clues,
    wrongGuesses: state.wrongGuesses,
    guessesUsed: wrongCount + (state.status === 'won' ? 1 : 0),
    guessNumber: Math.min(wrongCount + 1, MAX_GUESSES),
    unlockedCount,
    revealedCount: playing ? unlockedCount : clues.length,
    submitGuess,
    skipGuess,
    startPractice,
    backToDaily,
  };
}
