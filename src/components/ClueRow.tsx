import type { Clue } from '../types';
import { ClueBadge } from './ClueBadge';
import { ClueContent } from './ClueContent';
import { LockIcon } from './icons';

interface ClueRowProps {
  number: number;
  clue: Clue;
  revealed: boolean;
}

export function ClueRow({ number, clue, revealed }: ClueRowProps) {
  return (
    <li className="flex items-start gap-3.5 py-[7px]">
      <ClueBadge number={number} revealed={revealed} />
      {revealed ? (
        <div className="min-w-0 pt-0.5 text-[15px] leading-normal text-ink">
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
