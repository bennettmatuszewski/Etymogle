import { useId, useRef, useState, type FormEvent } from 'react';
import type { GuessResult } from '../types';
import { prefersReducedMotion } from '../lib/motion';
import { Button } from './Button';

const SHAKE: Keyframe[] = [0, -8, 7, -5, 3, 0].map((x) => ({ transform: `translateX(${x}px)` }));

interface GuessFormProps {
  onGuess: (raw: string) => GuessResult;
  onSkip: () => void;
  /** On the final guess, skipping ends the round, so the button offers to reveal the word. */
  isLastGuess: boolean;
}

export function GuessForm({ onGuess, onSkip, isLastGuess }: GuessFormProps) {
  const [value, setValue] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const hintId = useId();
  const isEmpty = value.trim() === '';

  // A quick head-shake for "not that one"; re-triggerable, unlike a CSS class.
  function shake() {
    if (prefersReducedMotion()) return;
    rowRef.current?.animate(SHAKE, { duration: 380, easing: 'ease-out' });
  }

  // Enter on an empty input lands here and is ignored, so a stray Enter never skips.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = onGuess(value);
    if (result === 'invalid') return;
    if (result === 'duplicate') {
      setHint('Already guessed — try another word.');
      shake();
      return;
    }
    if (result === 'wrong') shake();
    setValue('');
    setHint(null);
  }

  function handleSkip() {
    onSkip();
    setHint(null);
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div ref={rowRef} className="flex items-end gap-4">
        <label htmlFor={inputId} className="sr-only">
          Type your guess
        </label>
        <input
          ref={inputRef}
          id={inputId}
          name="guess"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
          placeholder="Type your guess…"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHint(null);
          }}
          aria-describedby={hint ? hintId : undefined}
          className="min-w-0 flex-1 border-0 border-b-[1.5px] border-underline bg-transparent px-1 py-3 text-[17px] text-ink transition-colors placeholder:text-faint focus:border-accent focus:outline-none"
        />
        {isEmpty ? (
          <Button variant="secondary" onClick={handleSkip} className="min-w-24">
            {isLastGuess ? 'Reveal' : 'Skip'}
          </Button>
        ) : (
          <Button type="submit" className="min-w-24">
            Guess
          </Button>
        )}
      </div>
      {hint && (
        <p id={hintId} role="status" className="px-1 text-[13px] italic text-muted motion-safe:animate-tick">
          {hint}
        </p>
      )}
    </form>
  );
}
