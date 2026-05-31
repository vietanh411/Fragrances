import { describe, it, expect } from 'vitest';
import { reconcileCart } from '@/store/cart-reconcile';
import type { CartItem, Product } from '@/lib/types';

const product = (over: Partial<Product>): Product => ({
  id: 'p1',
  brand: 'Brand',
  name: 'Name',
  gender: 'Unisex',
  category: 'Niche',
  available: true,
  sizes: [{ size: '5ml', price: 10, stock: 1 }],
  inspiredBy: null,
  fragranticaUrl: null,
  imageUrl: null,
  ...over,
});

const item = (over: Partial<CartItem>): CartItem => ({
  productId: 'p1',
  brand: 'Brand',
  name: 'Name',
  size: '5ml',
  unitPrice: 10,
  qty: 1,
  ...over,
});

describe('reconcileCart', () => {
  it('marks ok when product, size and price still match', () => {
    const out = reconcileCart([item({})], [product({})]);
    expect(out[0].status).toBe('ok');
  });

  it('marks unavailable when the product is gone', () => {
    const out = reconcileCart([item({})], []);
    expect(out[0].status).toBe('unavailable');
  });

  it('marks unavailable when the product is sold out', () => {
    const out = reconcileCart([item({})], [product({ available: false })]);
    expect(out[0].status).toBe('unavailable');
  });

  it('marks unavailable when the chosen size is no longer offered', () => {
    const out = reconcileCart([item({ size: '30ml' })], [product({})]);
    expect(out[0].status).toBe('unavailable');
  });

  it('flags a price change and reports the current price', () => {
    const out = reconcileCart([item({ unitPrice: 8 })], [product({ sizes: [{ size: '5ml', price: 10 }] })]);
    expect(out[0].status).toBe('price-changed');
    expect(out[0].currentPrice).toBe(10);
  });
});
