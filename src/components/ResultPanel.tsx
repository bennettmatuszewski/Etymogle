import { useEffect, useRef } from 'react';
import type { GameMode, WordEntry } from '../types';
import { formatPos } from '../lib/puzzle';
import { Button } from './Button';
import { ClueContent } from './ClueContent';
import { ChevronIcon } from './icons';
import { LineageTimeline } from './LineageTimeline';
import { SectionLabel } from './SectionLabel';

interface ResultPanelProps {
  status: 'won' | 'lost';
  entry: WordEntry;
  guessesUsed: number;
  mode: GameMode;
  onPractice: () => void;
  onBackToDaily: () => void;
}

export function ResultPanel({ status, entry, guessesUsed, mode, onPractice, onBackToDaily }: ResultPanelProps) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const pos = formatPos(entry.pos);
  const parts = entry.roots?.parts ?? [];

  // The guess input unmounts when the game ends, so hand focus to the next action.
  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  return (
    <div aria-live="polite" className="flex flex-col gap-4">
      <SectionLabel as="p">
        {status === 'won'
          ? `Solved in ${guessesUsed} ${guessesUsed === 1 ? 'guess' : 'guesses'}`
          : 'The word was'}
      </SectionLabel>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-serif text-[40px] font-semibold italic leading-none text-ink">{entry.word}</p>
        {pos && <span className="text-[14px] italic text-muted">{pos}</span>}
      </div>
      <div aria-hidden="true" className="h-[3px] w-10 rounded-xs bg-accent" />
      <SectionLabel as="h3">Word history</SectionLabel>
      <LineageTimeline entry={entry} />
      {parts.length >= 2 && (
        <p className="text-[15px] leading-normal text-ink">
          <ClueContent clue={{ kind: 'parts', parts, showForms: true }} />
        </p>
      )}
      <details className="group">
        <summary className="inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded-xs text-[14px] font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          <ChevronIcon className="size-3.5 transition-transform group-open:rotate-90" />
          Read the full etymology
        </summary>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink">{entry.etymology}</p>
      </details>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <Button ref={primaryRef} onClick={onPractice}>
          {mode === 'daily' ? 'Play a random word' : 'Play another'}
        </Button>
        {mode === 'practice' && (
          <Button variant="link" onClick={onBackToDaily}>
            Back to today’s word
          </Button>
        )}
      </div>
    </div>
  );
}
