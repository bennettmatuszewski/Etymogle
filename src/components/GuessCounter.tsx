import { ProgressPips } from './ProgressPips';
import { SectionLabel } from './SectionLabel';

interface GuessCounterProps {
  playing: boolean;
  guessNumber: number;
  guessesUsed: number;
  total: number;
}

export function GuessCounter({ playing, guessNumber, guessesUsed, total }: GuessCounterProps) {
  const label = playing ? `Guess ${guessNumber} of ${total}` : `${guessesUsed} of ${total} guesses used`;
  return (
    <div className="flex items-center justify-between">
      <SectionLabel variant="counter">{label}</SectionLabel>
      <ProgressPips filled={guessesUsed} total={total} />
    </div>
  );
}
