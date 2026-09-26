import type { ReactNode } from 'react';

const VARIANTS = {
  eyebrow: 'text-[12px] tracking-[0.14em]',
  label: 'text-[12px] tracking-[0.08em]',
  counter: 'text-[13px] tracking-[0.08em]',
};

interface SectionLabelProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  as?: 'span' | 'p' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

/** Small uppercase, letter-spaced label used for eyebrows and section headings. */
export function SectionLabel({
  children,
  variant = 'label',
  as: Tag = 'span',
  id,
  className = '',
}: SectionLabelProps) {
  return (
    <Tag id={id} className={`font-semibold uppercase text-muted ${VARIANTS[variant]} ${className}`}>
      {children}
    </Tag>
  );
}
