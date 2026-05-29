import type { Gender } from '@/lib/types';
import { cn } from '@/components/ui/cn';

export function GenderPill({ gender, className }: { gender: Gender; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-muted',
        className,
      )}
    >
      {gender}
    </span>
  );
}

export function StockStatus({ available }: { available: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-wide">
      <span
        className={cn('h-1.5 w-1.5 rounded-full', available ? 'bg-success' : 'bg-danger')}
        aria-hidden="true"
      />
      <span className={available ? 'text-muted' : 'text-danger'}>
        {available ? 'In stock' : 'Sold out'}
      </span>
    </span>
  );
}

export function BrandLabel({ brand, className }: { brand: string; className?: string }) {
  return <span className={cn('micro-label', className)}>{brand}</span>;
}
