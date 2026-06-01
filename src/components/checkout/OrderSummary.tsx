import type { CartItem, CartTotals } from '@/lib/types';
import { CartThumb } from '@/components/cart/CartThumb';
import { formatPrice } from '@/lib/price';

export function OrderSummary({ items, totals }: { items: CartItem[]; totals: CartTotals }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-ink-850 p-6">
      <h2 className="mb-5 font-display text-2xl text-champagne">Order Summary</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={`${item.productId}::${item.size}`} className="flex items-center gap-3">
            <CartThumb brand={item.brand} imageUrl={item.imageUrl} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-paper">{item.name}</p>
              <p className="text-xs text-muted">
                {item.brand} · {item.size} × {item.qty}
              </p>
            </div>
            <span className="text-sm tabular-nums text-paper">
              {formatPrice(item.unitPrice * item.qty)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-[var(--line)] pt-5 text-sm">
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
    </div>
  );
}
