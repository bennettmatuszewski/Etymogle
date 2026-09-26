import { XIcon } from './icons';

export function GuessChip({ word }: { word: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-[20px] bg-chip px-3 py-1.5 text-[13px] uppercase text-muted line-through">
      {word}
      <XIcon className="size-[11px] shrink-0 text-accent" />
    </li>
  );
}
