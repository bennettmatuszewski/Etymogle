interface ClueBadgeProps {
  number: number;
  revealed: boolean;
  /** Delay before the unlock pop, in ms. */
  delay?: number;
}

export function ClueBadge({ number, revealed, delay = 0 }: ClueBadgeProps) {
  return (
    <span
      aria-hidden="true"
      style={revealed ? { animationDelay: `${delay}ms` } : undefined}
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
        revealed ? 'bg-accent text-white motion-safe:animate-badge-pop' : 'border-[1.5px] border-lock text-muted'
      }`}
    >
      {number}
    </span>
  );
}
