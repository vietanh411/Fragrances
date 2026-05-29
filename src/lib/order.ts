// Shared order shape + sessionStorage handoff between checkout and confirmation.

import type { CartItem, CartTotals } from '@/lib/types';
import type { CheckoutCustomer } from '@/lib/checkout';
import { formatPrice } from '@/lib/price';

const KEY = 'va-decants-last-order';

export interface StoredOrder {
  orderNumber: string;
  items: CartItem[];
  totals: CartTotals;
  customer: CheckoutCustomer;
  method: string;
  createdAt: string;
}

export function saveLastOrder(order: StoredOrder): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* sessionStorage may be unavailable */
  }
}

export function readLastOrder(): StoredOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredOrder) : null;
  } catch {
    return null;
  }
}

/** Plain-text order summary for the "copy order details" fallback. */
export function orderToText(order: StoredOrder): string {
  const lines = order.items.map(
    (i) => `• ${i.brand} — ${i.name} | ${i.size} × ${i.qty} = ${formatPrice(i.unitPrice * i.qty)}`,
  );
  return [
    `VA Decants order ${order.orderNumber}`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatPrice(order.totals.subtotal)}`,
    `Shipping: ${order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}`,
    `Total: ${formatPrice(order.totals.grandTotal)}`,
    '',
    `Name: ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    order.customer.instagram ? `Instagram: ${order.customer.instagram}` : '',
    `Ship to: ${order.customer.address}`,
    `Paying via: ${order.method}`,
  ]
    .filter(Boolean)
    .join('\n');
}
