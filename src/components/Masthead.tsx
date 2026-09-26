import { SectionLabel } from './SectionLabel';

interface MastheadProps {
  eyebrow: string;
}

export function Masthead({ eyebrow }: MastheadProps) {
  return (
    <header className="max-w-[640px] text-center">
      <h1 className="font-serif text-[48px] font-semibold italic leading-none tracking-[0.01em] text-ink sm:text-[60px]">
        Etymogle
      </h1>
      <div aria-hidden="true" className="mx-auto mt-[18px] mb-[26px] h-[3px] w-16 rounded-xs bg-accent" />
      <SectionLabel variant="eyebrow" as="p" className="mb-2">
        {eyebrow}
      </SectionLabel>
      <p className="font-serif text-[22px] font-medium italic text-ink sm:text-[27px]">
        Guess the word. Uncover its history.
      </p>
    </header>
  );
}
