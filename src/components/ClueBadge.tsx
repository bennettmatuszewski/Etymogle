interface ClueBadgeProps {
  number: number;
  revealed: boolean;
}

export function ClueBadge({ number, revealed }: ClueBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
        revealed ? 'bg-accent text-white' : 'border-[1.5px] border-lock text-muted'
      }`}
    >
      {number}
    </span>
  );
}
