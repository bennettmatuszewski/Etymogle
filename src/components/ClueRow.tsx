import type { Clue } from '../types';
import { ClueBadge } from './ClueBadge';
import { ClueContent } from './ClueContent';
import { LockIcon } from './icons';

interface ClueRowProps {
  number: number;
  clue: Clue;
  revealed: boolean;
  /** Delay before the unlock animation, in ms. */
  delay?: number;
}

export function ClueRow({ number, clue, revealed, delay = 0 }: ClueRowProps) {
  return (
    <li className="flex items-start gap-3.5 py-[7px]">
      <ClueBadge number={number} revealed={revealed} delay={delay} />
      {revealed ? (
        <div
          className="min-w-0 pt-0.5 text-[15px] leading-normal text-ink motion-safe:animate-clue-in"
          style={{ animationDelay: `${delay}ms` }}
        >
          <ClueContent clue={clue} />
        </div>
      ) : (
        <p className="flex items-center gap-1.5 pt-0.5 text-[15px] italic text-muted">
          <LockIcon className="size-[13px] shrink-0" />
          Unlocks after your next guess
        </p>
      )}
    </li>
  );
}
