'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart-context';
import { reconcileCart, type ReconciledItem } from '@/store/cart-reconcile';
import type { Product } from '@/lib/types';
import { CartThumb } from '@/components/cart/CartThumb';
import { ShippingProgress } from '@/components/cart/ShippingProgress';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { Button, buttonClasses } from '@/components/ui/Button';
import { TrashIcon } from '@/components/ui/icons';
import { formatPrice } from '@/lib/price';

export default function CartPage() {
  const { items, totals, updateQty, removeItem, hydrated } = useCart();
  const [reconciled, setReconciled] = useState<ReconciledItem[] | null>(null);

  // Reconcile localStorage cart against current live inventory.
  useEffect(() => {
    if (!hydrated || items.length === 0) {
      setReconciled([]);
      return;
    }
    let cancelled = false;
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: { products: Product[] }) => {
        if (!cancelled) setReconciled(reconcileCart(items, data.products));
      })
      .catch(() => {
        if (!cancelled) setReconciled(items.map((i) => ({ ...i, status: 'ok', currentPrice: i.unitPrice })));
      });
    return () => {
      cancelled = true;
    };
  }, [items, hydrated]);

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <p className="font-display text-4xl text-champagne">Your selection is empty</p>
        <p className="text-muted">The collection awaits.</p>
        <Link href="/shop" className={buttonClasses({ size: 'lg' })}>
          Shop the Collection
        </Link>
      </div>
    );
  }

  const statusFor = (productId: string, size: string) =>
    reconciled?.find((r) => r.productId === productId && r.size === size);

  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-5xl text-champagne">Your Selection</h1>
      <div className="gilt-rule my-7" />

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-[var(--line)]">
          {items.map((item) => {
            const rec = statusFor(item.productId, item.size);
            const unavailable = rec?.status === 'unavailable';
            const priceChanged = rec?.status === 'price-changed';
            return (
              <li key={`${item.productId}::${item.size}`} className="flex gap-4 py-6">
                <CartThumb brand={item.brand} imageUrl={item.imageUrl} size={80} />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="micro-label !text-[0.6rem]">{item.brand}</p>
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-display text-2xl text-champagne hover:text-gold-300"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted">{item.size}</p>
                      {unavailable && (
                        <p className="mt-1 text-xs text-danger">No longer available — please remove.</p>
                      )}
                      {priceChanged && rec?.currentPrice != null && (
                        <p className="mt-1 text-xs text-warn">
                          Price updated to {formatPrice(rec.currentPrice)}.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-muted-2 transition-colors hover:text-danger"
                      aria-label={`Remove ${item.brand} ${item.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QuantityStepper
                      value={item.qty}
                      max={item.stock}
                      onChange={(q) => updateQty(item.productId, item.size, q)}
                    />
                    <span className="font-display text-xl text-champagne tabular-nums">
                      {formatPrice(item.unitPrice * item.qty)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-[var(--line)] bg-ink-850 p-6">
            <h2 className="mb-5 font-display text-2xl text-champagne">Order Summary</h2>
            <ShippingProgress subtotal={totals.subtotal} />
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-paper">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Shipping</dt>
                <dd className="tabular-nums text-paper">
                  {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3 font-display text-2xl text-champagne">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(totals.grandTotal)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className={buttonClasses({ size: 'lg', className: 'mt-6 w-full' })}>
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-xs uppercase tracking-wide text-muted hover:text-champagne"
            >
              Continue browsing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
