'use client';

import { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';
import { formatPrice } from '@/lib/price';
import { CopyIcon, CheckIcon, ExternalIcon } from '@/components/ui/icons';
import { cn } from '@/components/ui/cn';

interface Props {
  amount: number;
  /** Currently selected method label, controlled by the parent for the order. */
  value: string;
  onChange: (method: string) => void;
  orderNumber?: string;
}

export function PaymentMethods({ amount, value, onChange, orderNumber }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const methods = siteConfig.payments;
  const active = methods.find((m) => m.method === value) ?? methods[0];

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Payment method" className="flex flex-wrap gap-2">
        {methods.map((m) => {
          const selected = m.method === active.method;
          return (
            <button
              key={m.method}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(m.method)}
              className={cn(
                'rounded-md border px-4 py-2 text-xs uppercase tracking-wide transition-all',
                selected
                  ? 'border-gold-500 bg-gold-500/10 text-champagne shadow-glow'
                  : 'border-ink-600 text-muted hover:text-paper',
              )}
            >
              {m.method}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-[var(--line)] bg-ink-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {active.qr && (
            <Image
              src={active.qr}
              alt={`${active.method} QR code`}
              width={120}
              height={120}
              className="rounded-md border border-[var(--line)]"
            />
          )}
          <div className="flex-1 space-y-3">
            <div>
              <p className="micro-label !text-[0.6rem]">Send to ({active.method})</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded bg-ink-800 px-2 py-1 text-sm text-champagne">
                  {active.handle}
                </code>
                <button
                  type="button"
                  onClick={() => copy(active.handle, 'handle')}
                  className="text-muted transition-colors hover:text-gold-300"
                  aria-label="Copy handle"
                >
                  {copied === 'handle' ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
                </button>
              </div>
            </div>

            <p className="text-sm text-muted">
              Amount to send:{' '}
              <span className="font-medium text-champagne tabular-nums">{formatPrice(amount)}</span>
            </p>

            {active.link && (
              <a
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-400"
              >
                Open {active.method} <ExternalIcon width={14} height={14} />
              </a>
            )}
          </div>
        </div>

        <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs leading-relaxed text-muted">
          Send the total and include {orderNumber ? `order number ${orderNumber}` : 'your order number'} in
          the payment note. We hand-decant and ship as soon as payment arrives.
        </p>
      </div>
    </div>
  );
}
