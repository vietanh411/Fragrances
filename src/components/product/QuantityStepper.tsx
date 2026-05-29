'use client';

import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { cn } from '@/components/ui/cn';

interface Props {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, className }: Props) {
  return (
    <div className={cn('inline-flex items-center rounded border border-[var(--line)]', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-9 w-9 place-items-center text-paper/70 transition-colors hover:text-champagne disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <MinusIcon width={15} height={15} />
      </button>
      <span
        className="w-8 text-center text-sm tabular-nums text-champagne"
        aria-live="polite"
        aria-label={`Quantity ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-9 w-9 place-items-center text-paper/70 transition-colors hover:text-champagne disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <PlusIcon width={15} height={15} />
      </button>
    </div>
  );
}
