// Pure cart math — no React, fully unit-tested.

import type { CartItem, CartTotals, ShippingConfig, SizeKey } from '@/lib/types';

/** Identity for a cart line: a product at a specific size. */
export function lineKey(productId: string, size: SizeKey): string {
  return `${productId}::${size}`;
}

/** Compute subtotal, shipping, grand total and item count for a cart. */
export function totalsFor(items: CartItem[], shipping: ShippingConfig): CartTotals {
  const subtotal = round2(items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0));
  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  let ship = 0;
  if (subtotal > 0 && subtotal < shipping.freeThreshold) {
    ship = shipping.flatRate;
  }

  return {
    subtotal,
    shipping: ship,
    grandTotal: round2(subtotal + ship),
    itemCount,
  };
}

/** How far (in dollars) from the free-shipping threshold; 0 once reached. */
export function amountToFreeShipping(subtotal: number, shipping: ShippingConfig): number {
  return Math.max(0, round2(shipping.freeThreshold - subtotal));
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
