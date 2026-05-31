// Pure catalog filtering + sorting, shared by the catalog view and tested in isolation.

import type { Category, Gender, Product, SizeKey } from '@/lib/types';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'brand';

export interface CatalogFilters {
  categories: Category[];
  brands: string[];
  genders: Gender[];
  sizes: SizeKey[];
  query: string;
  inStockOnly: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: CatalogFilters = {
  categories: [],
  brands: [],
  genders: [],
  sizes: [],
  query: '',
  inStockOnly: false,
  sort: 'featured',
};

function lowestPrice(p: Product): number {
  return p.sizes.reduce((min, s) => Math.min(min, s.price), Infinity);
}

function matches(p: Product, f: CatalogFilters): boolean {
  if (f.categories.length && !f.categories.includes(p.category)) return false;
  if (f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.genders.length && !f.genders.includes(p.gender)) return false;
  if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s.size))) return false;
  if (f.inStockOnly && !p.available) return false;
  if (f.query.trim()) {
    const q = f.query.trim().toLowerCase();
    const haystack = `${p.brand} ${p.name} ${p.inspiredBy ?? ''}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  const filtered = products.filter((p) => matches(p, f));

  const sorted = [...filtered];
  switch (f.sort) {
    case 'price-asc':
      sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
      break;
    case 'price-desc':
      sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'brand':
      sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      break; // preserve sheet order
  }
  return sorted;
}
