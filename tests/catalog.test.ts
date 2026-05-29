import { describe, it, expect } from 'vitest';
import { filterProducts, EMPTY_FILTERS, type CatalogFilters } from '@/lib/catalog';
import type { Product } from '@/lib/types';

function p(partial: Partial<Product>): Product {
  return {
    id: partial.id ?? 'id',
    brand: partial.brand ?? 'Brand',
    name: partial.name ?? 'Name',
    gender: partial.gender ?? 'Unisex',
    category: partial.category ?? 'Niche',
    available: partial.available ?? true,
    sizes: partial.sizes ?? [{ size: '5ml', price: 10 }],
    inspiredBy: partial.inspiredBy ?? null,
    fragranticaUrl: null,
    imageUrl: null,
  };
}

const products: Product[] = [
  p({ id: 'a', brand: 'Roja Dove', name: 'Elysium', gender: 'Female', category: 'Niche', sizes: [{ size: '2ml', price: 6 }, { size: '5ml', price: 13 }] }),
  p({ id: 'b', brand: 'Louis Vuitton', name: 'Imagination', category: 'Designer', sizes: [{ size: '2ml', price: 9 }] }),
  p({ id: 'c', brand: 'Lattafa Perfumes', name: 'Khamrah', category: 'Dupe', sizes: [{ size: '30ml', price: 19 }], available: false }),
];

const f = (over: Partial<CatalogFilters>): CatalogFilters => ({ ...EMPTY_FILTERS, ...over });

describe('filterProducts', () => {
  it('returns all products with empty filters', () => {
    expect(filterProducts(products, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filters by category', () => {
    expect(filterProducts(products, f({ categories: ['Designer'] })).map((x) => x.id)).toEqual(['b']);
  });

  it('filters by gender', () => {
    expect(filterProducts(products, f({ genders: ['Female'] })).map((x) => x.id)).toEqual(['a']);
  });

  it('filters by offered size', () => {
    expect(filterProducts(products, f({ sizes: ['30ml'] })).map((x) => x.id)).toEqual(['c']);
  });

  it('filters by in-stock only', () => {
    expect(filterProducts(products, f({ inStockOnly: true })).map((x) => x.id)).toEqual(['a', 'b']);
  });

  it('searches brand, name, and inspiredBy', () => {
    expect(filterProducts(products, f({ query: 'khamrah' })).map((x) => x.id)).toEqual(['c']);
    expect(filterProducts(products, f({ query: 'roja' })).map((x) => x.id)).toEqual(['a']);
  });

  it('sorts by lowest price ascending and descending', () => {
    expect(filterProducts(products, f({ sort: 'price-asc' })).map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(filterProducts(products, f({ sort: 'price-desc' })).map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('sorts by name', () => {
    expect(filterProducts(products, f({ sort: 'name' })).map((x) => x.name)).toEqual([
      'Elysium',
      'Imagination',
      'Khamrah',
    ]);
  });
});
