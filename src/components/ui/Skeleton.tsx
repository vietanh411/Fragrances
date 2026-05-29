import { cn } from './cn';

/** Shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded bg-ink-700/60 bg-[linear-gradient(90deg,transparent,rgba(201,162,75,0.08),transparent)] bg-[length:200%_100%] animate-shimmer',
        className,
      )}
    />
  );
}
