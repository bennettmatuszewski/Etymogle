import { useId } from 'react';
import { GuessChip } from './GuessChip';
import { SectionLabel } from './SectionLabel';

export function GuessHistory({ guesses }: { guesses: string[] }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <SectionLabel as="h2" id={headingId}>
        Previous guesses
      </SectionLabel>
      {guesses.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {/* Skips repeat, so keys can't be the word itself; the list only ever grows. */}
          {guesses.map((word, i) => (
            <GuessChip key={i} word={word} />
          ))}
        </ul>
      ) : (
        <p className="py-1.5 text-[13px] italic text-muted">None yet</p>
      )}
    </section>
  );
}
