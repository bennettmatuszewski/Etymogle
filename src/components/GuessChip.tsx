import { SKIPPED } from '../lib/puzzle';
import { XIcon } from './icons';

export function GuessChip({ word }: { word: string }) {
  if (word === SKIPPED) {
    // py-[5px] + 1px border keeps the same height as a guess chip.
    return (
      <li className="inline-flex items-center rounded-[20px] border border-dashed border-lock px-3 py-[5px] text-[13px] italic text-muted motion-safe:animate-chip-in">
        Skipped
      </li>
    );
  }
  return (
    <li className="inline-flex items-center gap-1.5 rounded-[20px] bg-chip px-3 py-1.5 text-[13px] uppercase text-muted motion-safe:animate-chip-in">
      {word}
      <XIcon className="size-[11px] shrink-0 text-accent" />
    </li>
  );
}
