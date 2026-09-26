import { countLetters, formatPos } from '../lib/puzzle';

interface LetterHintProps {
  word: string;
  pos: string | null;
}

/** Always-visible word shape: one dash per letter, plus the count and part of speech. */
export function LetterHint({ word, pos }: LetterHintProps) {
  const count = countLetters(word);
  const posLabel = formatPos(pos);

  return (
    <div className="flex flex-col items-center gap-2">
      <div aria-hidden="true" className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="h-[3px] w-4 rounded-xs bg-underline" />
        ))}
      </div>
      <p className="text-[12px] text-muted">
        {count} letters{posLabel && ` · ${posLabel}`}
      </p>
    </div>
  );
}
