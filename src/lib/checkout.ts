// Building and submitting the manual-payment order to Web3Forms (email-to-owner).

import type { CartItem, CartTotals } from '@/lib/types';
import { formatPrice } from '@/lib/price';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export interface CheckoutCustomer {
  name: string;
  email: string;
  instagram?: string;
  address: string;
}

export interface Web3FormsPayload {
  access_key: string;
  subject: string;
  from_name: string;
  customer_name: string;
  customer_email: string;
  customer_instagram: string;
  shipping_address: string;
  order_number: string;
  order_lines: string;
  subtotal: string;
  shipping: string;
  grand_total: string;
  order_json: string;
  /** Honeypot — must stay empty; bots fill it and get rejected. */
  botcheck: string;
}

interface BuildArgs {
  items: CartItem[];
  totals: CartTotals;
  customer: CheckoutCustomer;
  accessKey: string;
  orderNumber: string;
}

/** Build the (pure, testable) Web3Forms request body for an order. */
export function buildWeb3FormsPayload({
  items,
  totals,
  customer,
  accessKey,
  orderNumber,
}: BuildArgs): Web3FormsPayload {
  const order_lines = items
    .map((i) => {
      const line = formatPrice(i.unitPrice * i.qty);
      return `${i.brand} — ${i.name} | ${i.size} × ${i.qty} @ ${formatPrice(i.unitPrice)} = ${line}`;
    })
    .join('\n');

  const order_json = JSON.stringify({
    orderNumber,
    items: items.map((i) => ({
      brand: i.brand,
      name: i.name,
      size: i.size,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: Math.round((i.unitPrice * i.qty + Number.EPSILON) * 100) / 100,
    })),
    totals,
  });

  return {
    access_key: accessKey,
    subject: `New VA Decants order ${orderNumber} — ${customer.name} (${formatPrice(totals.grandTotal)})`,
    from_name: 'VA Decants Storefront',
    customer_name: customer.name,
    customer_email: customer.email,
    customer_instagram: customer.instagram?.trim() || '—',
    shipping_address: customer.address,
    order_number: orderNumber,
    order_lines,
    subtotal: formatPrice(totals.subtotal),
    shipping: totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping),
    grand_total: formatPrice(totals.grandTotal),
    order_json,
    botcheck: '',
  };
}

export interface SubmitResult {
  ok: boolean;
  message: string;
}

/**
 * POST the order to Web3Forms. Retries once on a network error.
 * Returns ok=false (never throws) so the UI can show a graceful fallback.
 */
export async function submitOrder(payload: Web3FormsPayload): Promise<SubmitResult> {
  const attempt = async (): Promise<SubmitResult> => {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };
    return {
      ok: res.ok && body.success === true,
      message: body.message ?? (res.ok ? 'Submitted' : `Request failed (${res.status})`),
    };
  };

  try {
    return await attempt();
  } catch {
    // One retry on transient network failure.
    try {
      return await attempt();
    } catch {
      return {
        ok: false,
        message: 'Network error — please check your connection and try again.',
      };
    }
  }
}

/** Generate a human-friendly order number, e.g. "VA-LX3K9Q". */
export function makeOrderNumber(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `VA-${time}${rand}`;
}
