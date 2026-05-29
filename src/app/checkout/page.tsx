'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart-context';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { buttonClasses } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, totals, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <p className="font-display text-4xl text-champagne">Your cart is empty</p>
        <p className="text-muted">Add a few decants before checking out.</p>
        <Link href="/catalog" className={buttonClasses({ size: 'lg' })}>
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-5xl text-champagne">Checkout</h1>
      <div className="gilt-rule my-7" />
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <CheckoutForm />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} totals={totals} />
        </aside>
      </div>
    </div>
  );
}
