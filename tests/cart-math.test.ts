import { describe, it, expect } from 'vitest';
import { totalsFor, lineKey } from '@/store/cart-math';
import type { CartItem } from '@/lib/types';

const shipping = { flatRate: 6, freeThreshold: 50 };

function item(partial: Partial<CartItem>): CartItem {
  return {
    productId: 'p',
    brand: 'Brand',
    name: 'Name',
    size: '5ml',
    unitPrice: 10,
    qty: 1,
    ...partial,
  };
}

describe('lineKey', () => {
  it('keys a line by product + size so sizes are distinct lines', () => {
    expect(lineKey('louis-vuitton-imagination', '5ml')).toBe(
      'louis-vuitton-imagination::5ml',
    );
    expect(lineKey('p', '5ml')).not.toBe(lineKey('p', '10ml'));
  });
});

describe('totalsFor', () => {
  it('returns zeros for an empty cart (no shipping charge)', () => {
    expect(totalsFor([], shipping)).toEqual({
      subtotal: 0,
      shipping: 0,
      grandTotal: 0,
      itemCount: 0,
    });
  });

  it('sums distinct size lines and quantities', () => {
    const items = [
      item({ productId: 'a', size: '2ml', unitPrice: 4, qty: 2 }), // 8
      item({ productId: 'a', size: '5ml', unitPrice: 8, qty: 1 }), // 8
    ];
    const t = totalsFor(items, shipping);
    expect(t.subtotal).toBe(16);
    expect(t.itemCount).toBe(3);
  });

  it('charges flat-rate shipping under the free threshold', () => {
    const items = [item({ unitPrice: 20, qty: 1 })]; // 20
    const t = totalsFor(items, shipping);
    expect(t.shipping).toBe(6);
    expect(t.grandTotal).toBe(26);
  });

  it('gives free shipping at exactly the threshold', () => {
    const items = [item({ unitPrice: 25, qty: 2 })]; // 50
    const t = totalsFor(items, shipping);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(50);
  });

  it('gives free shipping above the threshold', () => {
    const items = [item({ unitPrice: 60, qty: 1 })];
    const t = totalsFor(items, shipping);
    expect(t.shipping).toBe(0);
    expect(t.grandTotal).toBe(60);
  });
});
