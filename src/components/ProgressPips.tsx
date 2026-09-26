interface ProgressPipsProps {
  filled: number;
  total: number;
}

export function ProgressPips({ filled, total }: ProgressPipsProps) {
  return (
    <div aria-hidden="true" className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`size-2.5 rounded-full ${i < filled ? 'bg-accent' : 'bg-pip'}`} />
      ))}
    </div>
  );
}
