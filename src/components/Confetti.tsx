import { useEffect, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from '../lib/motion';

// Parchment accent plus warm companions; ink adds a few dark flecks.
const COLORS = ['var(--color-accent)', '#d08a4e', '#c9a04a', '#5b7b6e', '#8a6e4b', 'var(--color-ink)'];
const PIECE_COUNT = 90;
// Longest delay (0.6s) + longest fall (4.2s), with a little slack.
const LIFETIME_MS = 5000;

interface Piece {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  flutter: number;
  color: string;
  width: number;
  height: number;
  round: boolean;
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, () => {
    const round = Math.random() < 0.25;
    const width = 6 + Math.random() * 6;
    return {
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.8,
      drift: (Math.random() - 0.5) * 240,
      spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540),
      flutter: 0.5 + Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width,
      height: round ? width : width * (0.4 + Math.random() * 0.5),
      round,
    };
  });
}

/** A one-shot shower of paper confetti over the page; removes itself once it has fallen. */
export function Confetti() {
  const [pieces] = useState(() => (prefersReducedMotion() ? [] : makePieces()));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, []);

  if (done || pieces.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti-fall"
          style={
            {
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            } as CSSProperties
          }
        >
          <span
            className={`block animate-confetti-flutter ${piece.round ? 'rounded-full' : 'rounded-[1px]'}`}
            style={{
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
              animationDuration: `${piece.flutter}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
