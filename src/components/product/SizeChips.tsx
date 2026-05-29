'use client';

import { useRef } from 'react';
import type { SizeOption, SizeKey } from '@/lib/types';
import { formatPrice } from '@/lib/price';
import { cn } from '@/components/ui/cn';

interface Props {
  options: SizeOption[];
  value: SizeKey;
  onChange: (size: SizeKey) => void;
}

export function SizeChips({ options, value, onChange }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + options.length) % options.length;
    onChange(options[next].size);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label="Choose a size" className="flex flex-wrap gap-2.5">
      {options.map((opt, i) => {
        const active = opt.size === value;
        return (
          <button
            key={opt.size}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.size)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'flex min-w-[84px] flex-col items-start rounded-md border px-4 py-2.5 transition-all duration-200 ease-luxe',
              active
                ? 'border-gold-500 bg-gold-500/10 shadow-glow'
                : 'border-ink-600 hover:border-gold-500/40',
            )}
          >
            <span className={cn('text-sm', active ? 'text-champagne' : 'text-paper/80')}>
              {opt.size}
            </span>
            <span className="text-xs tabular-nums text-muted">{formatPrice(opt.price)}</span>
          </button>
        );
      })}
    </div>
  );
}
