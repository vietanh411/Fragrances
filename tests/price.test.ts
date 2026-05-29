import { describe, it, expect } from 'vitest';
import { parsePrice, formatPrice } from '@/lib/price';

describe('parsePrice', () => {
  it('parses comma-decimal currency from the sheet', () => {
    expect(parsePrice('$4,00')).toBe(4);
    expect(parsePrice('$7,00')).toBe(7);
    expect(parsePrice('$15,00')).toBe(15);
    expect(parsePrice('$55,00')).toBe(55);
  });

  it('parses non-zero cents', () => {
    expect(parsePrice('$4,50')).toBe(4.5);
    expect(parsePrice('$10,99')).toBe(10.99);
  });

  it('also accepts period-decimal currency', () => {
    expect(parsePrice('$4.00')).toBe(4);
    expect(parsePrice('$12.50')).toBe(12.5);
  });

  it('tolerates surrounding whitespace and missing dollar sign', () => {
    expect(parsePrice('  $8,00 ')).toBe(8);
    expect(parsePrice('8,00')).toBe(8);
    expect(parsePrice('8')).toBe(8);
  });

  it('returns null for blank or unparseable input', () => {
    expect(parsePrice('')).toBeNull();
    expect(parsePrice('   ')).toBeNull();
    expect(parsePrice(undefined as unknown as string)).toBeNull();
    expect(parsePrice('🔗 Link')).toBeNull();
    expect(parsePrice('N/A')).toBeNull();
  });
});

describe('formatPrice', () => {
  it('always renders US dollars with a period', () => {
    expect(formatPrice(4)).toBe('$4.00');
    expect(formatPrice(15)).toBe('$15.00');
    expect(formatPrice(4.5)).toBe('$4.50');
  });
});
