import { ProgressPips } from './ProgressPips';
import { SectionLabel } from './SectionLabel';

interface GuessCounterProps {
  playing: boolean;
  guessNumber: number;
  guessesUsed: number;
  total: number;
}

export function GuessCounter({ playing, guessNumber, guessesUsed, total }: GuessCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <SectionLabel variant="counter">
        {playing ? `Guess ${guessNumber} of ${total}` : `${guessesUsed} of ${total} guesses used`}
      </SectionLabel>
      <ProgressPips filled={guessesUsed} total={total} />
    </div>
  );
}
