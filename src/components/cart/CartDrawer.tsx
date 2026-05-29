'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart-context';
import { Drawer } from '@/components/ui/Overlay';
import { buttonClasses } from '@/components/ui/Button';
import { CloseIcon, TrashIcon, BagIcon } from '@/components/ui/icons';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { CartThumb } from './CartThumb';
import { ShippingProgress } from './ShippingProgress';
import { formatPrice } from '@/lib/price';

export function CartDrawer() {
  const { isOpen, closeCart, items, totals, updateQty, removeItem } = useCart();

  return (
    <Drawer open={isOpen} onClose={closeCart} title="Your selection">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <h2 className="font-display text-2xl text-champagne">
          Your Selection
          {totals.itemCount > 0 && (
            <span className="ml-2 text-sm text-muted">({totals.itemCount})</span>
          )}
        </h2>
        <button
          onClick={closeCart}
          className="text-paper/70 transition-colors hover:text-champagne"
          aria-label="Close cart"
        >
          <CloseIcon />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <BagIcon width={36} height={36} className="text-gold-500/50" />
          <p className="text-muted">Your selection is empty — the collection awaits.</p>
          <Link href="/catalog" onClick={closeCart} className={buttonClasses({ className: 'mt-1' })}>
            Explore the Collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-[var(--line)] overflow-y-auto px-5">
            {items.map((item) => (
              <li key={`${item.productId}::${item.size}`} className="flex gap-3 py-4">
                <CartThumb brand={item.brand} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="micro-label !text-[0.58rem]">{item.brand}</p>
                      <p className="truncate font-display text-lg text-champagne">{item.name}</p>
                      <p className="text-xs text-muted">
                        {item.size} · {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-muted-2 transition-colors hover:text-danger"
                      aria-label={`Remove ${item.brand} ${item.name} ${item.size}`}
                    >
                      <TrashIcon width={17} height={17} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      value={item.qty}
                      onChange={(q) => updateQty(item.productId, item.size, q)}
                    />
                    <span className="text-sm tabular-nums text-paper">
                      {formatPrice(item.unitPrice * item.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-4 border-t border-[var(--line)] px-5 py-5">
            <ShippingProgress subtotal={totals.subtotal} />
            <dl className="space-y-1.5 text-sm">
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
              <div className="flex justify-between border-t border-[var(--line)] pt-2 font-display text-xl text-champagne">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(totals.grandTotal)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={buttonClasses({ size: 'lg', className: 'w-full' })}
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </Drawer>
  );
}
