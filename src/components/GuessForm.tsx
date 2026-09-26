import { useId, useState, type FormEvent } from 'react';
import type { GuessResult } from '../types';
import { Button } from './Button';

interface GuessFormProps {
  onGuess: (raw: string) => GuessResult;
}

export function GuessForm({ onGuess }: GuessFormProps) {
  const [value, setValue] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const inputId = useId();
  const hintId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = onGuess(value);
    if (result === 'invalid') return;
    if (result === 'duplicate') {
      setHint('Already guessed — try another word.');
      return;
    }
    setValue('');
    setHint(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-end gap-4">
        <label htmlFor={inputId} className="sr-only">
          Type your guess
        </label>
        <input
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
          className="min-w-0 flex-1 border-0 border-b-[1.5px] border-underline bg-transparent px-1 py-3 text-[17px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <Button type="submit">Guess</Button>
      </div>
      {hint && (
        <p id={hintId} role="status" className="px-1 text-[13px] italic text-muted">
          {hint}
        </p>
      )}
    </form>
  );
}
