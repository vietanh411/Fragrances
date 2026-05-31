'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { filterProducts, type SortKey } from '@/lib/shop';
import { useUrlFilters } from '@/lib/useUrlFilters';
import { FilterControls } from './FilterControls';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Drawer } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';
import { CloseIcon, SearchIcon } from '@/components/ui/icons';
import { cn } from '@/components/ui/cn';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'brand', label: 'Brand (A–Z)' },
];

interface Props {
  products: Product[];
  brands: { name: string; count: number }[];
}

export function CatalogView({ products, brands }: Props) {
  const { filters, setFilters, reset } = useUrlFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.genders.length +
    filters.sizes.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.query ? 1 : 0);

  const chips = [
    ...filters.categories.map((c) => ({ label: c, clear: () => setFilters({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.genders.map((g) => ({ label: g, clear: () => setFilters({ genders: filters.genders.filter((x) => x !== g) }) })),
    ...filters.sizes.map((s) => ({ label: s, clear: () => setFilters({ sizes: filters.sizes.filter((x) => x !== s) }) })),
    ...filters.brands.map((b) => ({ label: b, clear: () => setFilters({ brands: filters.brands.filter((x) => x !== b) }) })),
    ...(filters.inStockOnly ? [{ label: 'In stock', clear: () => setFilters({ inStockOnly: false }) }] : []),
  ];

  return (
    <div className="container-luxe grid gap-10 py-10 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-2xl text-champagne">Refine</h2>
            {activeCount > 0 && (
              <button onClick={reset} className="text-xs text-gold-300 hover:text-gold-400">
                Clear all
              </button>
            )}
          </div>
          <FilterControls filters={filters} brands={brands} onChange={setFilters} />
        </div>
      </aside>

      <div>
        {/* search + sort + count bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2" width={18} height={18} />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters({ query: e.target.value })}
              placeholder="Search by brand or fragrance…"
              className="w-full rounded border border-ink-600 bg-ink-900 py-2.5 pl-10 pr-3 text-sm text-paper placeholder:text-muted-2 focus:border-gold-500/50"
              aria-label="Search fragrances"
            />
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded border border-ink-600 px-4 py-2.5 text-xs uppercase tracking-wide text-paper/80 lg:hidden"
          >
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[0.62rem] text-ink-900">
                {activeCount}
              </span>
            )}
          </button>

          <label className="flex items-center gap-2 text-xs text-muted">
            <span className="hidden sm:inline uppercase tracking-wide">Sort</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value as SortKey })}
              className="rounded border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper focus:border-gold-500/50"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-ink-850">
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted tabular-nums">
            {results.length} {results.length === 1 ? 'fragrance' : 'fragrances'}
          </span>
          {chips.map((chip, i) => (
            <button
              key={`${chip.label}-${i}`}
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-ink-800 px-3 py-1 text-xs text-paper/80 hover:border-gold-500/40"
            >
              {chip.label}
              <CloseIcon width={12} height={12} />
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[var(--line)] py-24 text-center">
            <div className="gilt-rule w-10" />
            <p className="font-display text-2xl text-champagne">Nothing matches just yet.</p>
            <p className="max-w-sm text-sm text-muted">
              Try broadening your filters or searching a different brand.
            </p>
            <Button variant="ghost" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" side="left">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-display text-2xl text-champagne">Refine</h2>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="text-paper/70 hover:text-champagne">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <FilterControls filters={filters} brands={brands} onChange={setFilters} />
        </div>
        <div className="flex gap-3 border-t border-[var(--line)] px-5 py-4">
          {activeCount > 0 && (
            <Button variant="ghost" className="flex-1" onClick={reset}>
              Clear all
            </Button>
          )}
          <Button className={cn('flex-1')} onClick={() => setDrawerOpen(false)}>
            Show {results.length} results
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
