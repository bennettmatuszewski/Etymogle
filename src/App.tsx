import { ClueList } from './components/ClueList';
import { Divider } from './components/Divider';
import { GameCard } from './components/GameCard';
import { GuessCounter } from './components/GuessCounter';
import { GuessForm } from './components/GuessForm';
import { GuessHistory } from './components/GuessHistory';
import { LetterHint } from './components/LetterHint';
import { Masthead } from './components/Masthead';
import { ResultPanel } from './components/ResultPanel';
import { useGame } from './hooks/useGame';
import { MAX_GUESSES } from './lib/puzzle';

function App() {
  const game = useGame();
  // Remount the form/result per word so input, hints and focus reset.
  const roundKey = `${game.mode}:${game.entry.word}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[26px] px-4 pt-12 pb-10 sm:px-16">
      <Masthead eyebrow={game.mode === 'daily' ? 'Today’s word' : 'Practice word'} />

      <GameCard>
        <GuessCounter
          playing={game.status === 'playing'}
          guessNumber={game.guessNumber}
          guessesUsed={game.guessesUsed}
          total={MAX_GUESSES}
        />

        {game.status === 'playing' ? (
          <>
            <LetterHint word={game.entry.word} pos={game.entry.pos} />
            <GuessForm key={roundKey} onGuess={game.submitGuess} />
          </>
        ) : (
          <ResultPanel
            key={roundKey}
            status={game.status}
            entry={game.entry}
            guessesUsed={game.guessesUsed}
            mode={game.mode}
            onPractice={game.startPractice}
            onBackToDaily={game.backToDaily}
          />
        )}

        <GuessHistory guesses={game.wrongGuesses} />
        <Divider />
        <ClueList clues={game.clues} revealedCount={game.revealedCount} />
      </GameCard>
    </div>
  );
}

export default App;
