// Reconcile a (possibly stale) localStorage cart against current product data.

import type { CartItem, Product } from '@/lib/types';

export type LineStatus = 'ok' | 'unavailable' | 'price-changed';

export interface ReconciledItem extends CartItem {
  status: LineStatus;
  currentPrice: number | null;
}

export function reconcileCart(items: CartItem[], products: Product[]): ReconciledItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return items.map((item) => {
    const product = byId.get(item.productId);
    const option = product?.sizes.find((s) => s.size === item.size);

    if (!product || !product.available || !option) {
      return { ...item, status: 'unavailable', currentPrice: null };
    }
    if (option.price !== item.unitPrice) {
      return { ...item, status: 'price-changed', currentPrice: option.price };
    }
    return { ...item, status: 'ok', currentPrice: option.price };
  });
}
