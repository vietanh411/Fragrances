'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readLastOrder, orderToText, type StoredOrder } from '@/lib/order';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import { Button, buttonClasses } from '@/components/ui/Button';
import { CheckIcon, CopyIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';

export default function ConfirmationPage() {
  const [order, setOrder] = useState<StoredOrder | null | undefined>(undefined);
  const [method, setMethod] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const o = readLastOrder();
    setOrder(o);
    if (o) setMethod(o.method);
  }, []);

  if (order === undefined) return null; // hydrating

  if (!order) {
    return (
      <div className="container-luxe flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <p className="font-display text-4xl text-champagne">No recent order</p>
        <p className="text-muted">Your order details are no longer available on this device.</p>
        <Link href="/catalog" className={buttonClasses({ size: 'lg' })}>
          Explore the Collection
        </Link>
      </div>
    );
  }

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(orderToText(order!));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="container-luxe py-14">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
          <CheckIcon width={28} height={28} />
        </div>
        <p className="micro-label">Order received</p>
        <h1 className="mt-3 font-display text-5xl text-champagne">Thank you — your order is reserved.</h1>
        <p className="mt-4 text-muted">
          Order number{' '}
          <span className="font-medium text-champagne tabular-nums">{order.orderNumber}</span>. Save
          this number and include it with your payment.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="mb-4 font-display text-2xl text-champagne">How to pay</h2>
          <PaymentMethods
            amount={order.totals.grandTotal}
            value={method}
            onChange={setMethod}
            orderNumber={order.orderNumber}
          />
          <p className="mt-4 text-sm text-muted">{siteConfig.turnaround}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={copyDetails}>
              {copied ? <><CheckIcon width={16} height={16} /> Copied</> : <><CopyIcon width={16} height={16} /> Copy order details</>}
            </Button>
            <Link href="/catalog" className={buttonClasses({ variant: 'ghost' })}>
              Continue shopping
            </Link>
          </div>
        </div>

        <OrderSummary items={order.items} totals={order.totals} />
      </div>
    </div>
  );
}
