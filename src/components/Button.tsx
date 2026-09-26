import type { ComponentProps } from 'react';

const VARIANTS = {
  primary:
    'rounded-[10px] bg-accent px-[26px] py-[13px] text-[15px] font-semibold text-white hover:brightness-94',
  // Same footprint as primary: the 1.5px border replaces 1.5px of vertical padding.
  secondary:
    'rounded-[10px] border-[1.5px] border-accent px-[26px] py-[11.5px] text-[15px] font-semibold text-accent hover:bg-chip',
  link: 'rounded-xs text-[15px] font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent',
};

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof VARIANTS;
};

export function Button({ variant = 'primary', type = 'button', className = '', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer whitespace-nowrap transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:active:scale-[0.97] ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  );
}
