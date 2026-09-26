import { useId } from 'react';
import type { Clue } from '../types';
import { ClueRow } from './ClueRow';

// A clue unlocks just after the guess chip lands; the rest cascade when the game ends.
const REVEAL_DELAY_MS = 120;
const CASCADE_STEP_MS = 110;

interface ClueListProps {
  clues: Clue[];
  revealedCount: number;
  /** Clues earned by guessing; any beyond this were revealed by the game ending. */
  unlockedCount: number;
}

export function ClueList({ clues, revealedCount, unlockedCount }: ClueListProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-0.5">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h2 id={headingId} className="font-serif text-[18px] font-semibold text-ink">
          Clues
        </h2>
        <span className="text-[12px] text-muted">
          {revealedCount} of {clues.length} revealed
        </span>
      </div>
      <ol aria-live="polite" className="flex flex-col gap-0.5">
        {clues.map((clue, i) => (
          <ClueRow
            key={i}
            number={i + 1}
            clue={clue}
            revealed={i < revealedCount}
            delay={REVEAL_DELAY_MS + Math.max(0, i - unlockedCount + 1) * CASCADE_STEP_MS}
          />
        ))}
      </ol>
    </section>
  );
}
