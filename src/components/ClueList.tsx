import { useId } from 'react';
import type { Clue } from '../types';
import { ClueRow } from './ClueRow';

interface ClueListProps {
  clues: Clue[];
  revealedCount: number;
}

export function ClueList({ clues, revealedCount }: ClueListProps) {
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
          <ClueRow key={i} number={i + 1} clue={clue} revealed={i < revealedCount} />
        ))}
      </ol>
    </section>
  );
}
