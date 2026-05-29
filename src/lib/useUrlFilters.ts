'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  EMPTY_FILTERS,
  type CatalogFilters,
  type SortKey,
} from '@/lib/catalog';
import type { Category, Gender, SizeKey } from '@/lib/types';

const SORTS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'name', 'brand'];

function list(sp: URLSearchParams, key: string): string[] {
  const v = sp.get(key);
  return v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

/** Read filter state from the URL and provide a setter that writes it back. */
export function useUrlFilters(): {
  filters: CatalogFilters;
  setFilters: (next: Partial<CatalogFilters>) => void;
  reset: () => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const filters = useMemo<CatalogFilters>(() => {
    const sortParam = sp.get('sort') as SortKey | null;
    return {
      categories: list(sp, 'category') as Category[],
      brands: list(sp, 'brand'),
      genders: list(sp, 'gender') as Gender[],
      sizes: list(sp, 'size') as SizeKey[],
      query: sp.get('q') ?? '',
      inStockOnly: sp.get('stock') === '1',
      sort: sortParam && SORTS.includes(sortParam) ? sortParam : 'featured',
    };
  }, [sp]);

  const setFilters = useCallback(
    (next: Partial<CatalogFilters>) => {
      const merged = { ...filters, ...next };
      const params = new URLSearchParams();
      if (merged.categories.length) params.set('category', merged.categories.join(','));
      if (merged.brands.length) params.set('brand', merged.brands.join(','));
      if (merged.genders.length) params.set('gender', merged.genders.join(','));
      if (merged.sizes.length) params.set('size', merged.sizes.join(','));
      if (merged.query.trim()) params.set('q', merged.query.trim());
      if (merged.inStockOnly) params.set('stock', '1');
      if (merged.sort !== 'featured') params.set('sort', merged.sort);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, setFilters, reset };
}

export { EMPTY_FILTERS };
