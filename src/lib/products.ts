// The single entry point for product data, used by Server Components and the
// /api/products route. Fetches the live Sheet, parses it, and falls back to a
// committed snapshot so the storefront is never empty.

import { fetchSheetCsv } from '@/lib/sheet';
import { parseProducts } from '@/lib/parse';
import { FALLBACK_CSV } from '@/lib/fallback-csv';
import type { Product, ProductData } from '@/lib/types';

export async function getProductData(): Promise<ProductData> {
  const result = await fetchSheetCsv();

  if (result.ok && result.csv) {
    const data = parseProducts(result.csv);
    if (data.products.length > 0) {
      return data;
    }
    // Parsed but empty → treat like a failure and fall back.
    data.errors.push('Live sheet parsed to zero products; using fallback snapshot.');
  }

  const fallback = parseProducts(FALLBACK_CSV);
  return {
    ...fallback,
    source: 'fallback',
    errors: [
      ...(result.error ? [`Live sheet unavailable: ${result.error}`] : []),
      ...fallback.errors,
    ],
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await getProductData()).products;
}

export async function findProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === slug) ?? null;
}

/** Brand list with counts, for the catalog brand filter. */
export function brandFacets(products: Product[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
