'use client';

import { useState } from 'react';
import type { CatalogFilters } from '@/lib/shop';
import type { Category, Gender, SizeKey } from '@/lib/types';
import { SIZE_ORDER } from '@/lib/types';
import { ChevronDownIcon } from '@/components/ui/icons';
import { cn } from '@/components/ui/cn';

const CATEGORIES: Category[] = ['Niche', 'Designer', 'Dupe'];
const GENDERS: Gender[] = ['Male', 'Female', 'Unisex'];

interface Props {
  filters: CatalogFilters;
  brands: { name: string; count: number }[];
  onChange: (next: Partial<CatalogFilters>) => void;
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function FilterGroup({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--line)] py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="micro-label">{label}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={cn('text-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-muted hover:text-paper">
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            'grid h-4 w-4 place-items-center rounded-sm border transition-colors',
            checked ? 'border-gold-500 bg-gold-500/20' : 'border-ink-600',
          )}
        >
          {checked && <span className="h-1.5 w-1.5 rounded-[1px] bg-gold-400" />}
        </span>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <span className={cn(checked && 'text-champagne')}>{label}</span>
      </span>
      {count != null && <span className="text-xs text-muted-2 tabular-nums">{count}</span>}
    </label>
  );
}

export function FilterControls({ filters, brands, onChange }: Props) {
  const [brandQuery, setBrandQuery] = useState('');
  const visibleBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandQuery.toLowerCase()),
  );

  return (
    <div>
      <FilterGroup label="Category">
        {CATEGORIES.map((c) => (
          <Check
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onChange={() => onChange({ categories: toggle(filters.categories, c) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Gender">
        {GENDERS.map((g) => (
          <Check
            key={g}
            label={g}
            checked={filters.genders.includes(g)}
            onChange={() => onChange({ genders: toggle(filters.genders, g) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Size">
        <div className="flex flex-wrap gap-2">
          {SIZE_ORDER.map((s) => {
            const active = filters.sizes.includes(s as SizeKey);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ sizes: toggle(filters.sizes, s as SizeKey) })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  active
                    ? 'border-gold-500 bg-gold-500/15 text-champagne'
                    : 'border-ink-600 text-muted hover:text-paper',
                )}
                aria-pressed={active}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Availability">
        <Check
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>

      <FilterGroup label={`Brand (${brands.length})`} defaultOpen={false}>
        <input
          type="search"
          value={brandQuery}
          onChange={(e) => setBrandQuery(e.target.value)}
          placeholder="Search brands…"
          className="mb-2 w-full rounded border border-ink-600 bg-ink-900 px-3 py-1.5 text-sm text-paper placeholder:text-muted-2 focus:border-gold-500/50"
          aria-label="Search brands"
        />
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {visibleBrands.map((b) => (
            <Check
              key={b.name}
              label={b.name}
              count={b.count}
              checked={filters.brands.includes(b.name)}
              onChange={() => onChange({ brands: toggle(filters.brands, b.name) })}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}
