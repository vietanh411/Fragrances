import { describe, it, expect } from 'vitest';
import { parseProducts } from '@/lib/parse';
import { FALLBACK_CSV } from '@/lib/fallback-csv';

describe('fallback snapshot', () => {
  it('parses to the full catalog so the store is never blank', () => {
    const data = parseProducts(FALLBACK_CSV);
    expect(data.products.length).toBe(46);
    expect(data.categories).toEqual(['Niche', 'Designer', 'Dupe']);
  });
});
