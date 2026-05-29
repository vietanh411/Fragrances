import { forwardRef } from 'react';
import { cn } from './cn';

type Variant = 'gold' | 'solid' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium rounded uppercase ' +
  'tracking-[0.14em] transition-all duration-200 ease-luxe ' +
  'disabled:opacity-40 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  gold: 'btn-gold',
  solid: 'bg-champagne text-ink-900 hover:bg-gold-300',
  ghost: 'text-paper/80 hover:text-champagne border border-transparent hover:border-ink-600',
  danger: 'text-danger border border-danger/40 hover:bg-danger/10',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[0.7rem]',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-7 py-3.5 text-[0.78rem]',
};

/** Compose button classes — reuse on <Link> to style links as buttons. */
export function buttonClasses(opts: { variant?: Variant; size?: Size; className?: string } = {}) {
  const { variant = 'gold', size = 'md', className } = opts;
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'gold', size = 'md', className, ...props },
  ref,
) {
  return <button ref={ref} className={buttonClasses({ variant, size, className })} {...props} />;
});
