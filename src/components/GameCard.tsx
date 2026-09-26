import type { ReactNode } from 'react';

export function GameCard({ children }: { children: ReactNode }) {
  return (
    <main className="flex w-full max-w-[600px] flex-col gap-[22px] rounded-[20px] border border-card-edge bg-card px-6 py-7 shadow-card [animation-delay:100ms] motion-safe:animate-rise-in sm:px-10 sm:py-9">
      {children}
    </main>
  );
}
