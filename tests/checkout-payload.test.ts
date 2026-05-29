import { describe, it, expect } from 'vitest';
import { buildWeb3FormsPayload, type CheckoutCustomer } from '@/lib/checkout';
import type { CartItem, CartTotals } from '@/lib/types';

const items: CartItem[] = [
  { productId: 'a', brand: 'Roja Dove', name: 'Elysium', size: '5ml', unitPrice: 13, qty: 2 },
  { productId: 'b', brand: 'Montale', name: 'Intense Cafe', size: '2ml', unitPrice: 5, qty: 1 },
];

const totals: CartTotals = { subtotal: 31, shipping: 6, grandTotal: 37, itemCount: 3 };

const customer: CheckoutCustomer = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  instagram: '@jane',
  address: '123 Main St, Norman, OK 73019',
};

describe('buildWeb3FormsPayload', () => {
  const payload = buildWeb3FormsPayload({
    items,
    totals,
    customer,
    accessKey: 'test-key',
    orderNumber: 'VA-ABC123',
  });

  it('includes the access key and a honeypot field', () => {
    expect(payload.access_key).toBe('test-key');
    expect(payload).toHaveProperty('botcheck');
  });

  it('puts the customer name, order number, and total in the subject', () => {
    expect(payload.subject).toContain('Jane Doe');
    expect(payload.subject).toContain('VA-ABC123');
    expect(payload.subject).toContain('$37.00');
  });

  it('includes all customer contact fields', () => {
    expect(payload.customer_name).toBe('Jane Doe');
    expect(payload.customer_email).toBe('jane@example.com');
    expect(payload.customer_instagram).toBe('@jane');
    expect(payload.shipping_address).toContain('Norman');
  });

  it('lists every line item with brand, name, size, qty, unit and line total', () => {
    expect(payload.order_lines).toContain('Roja Dove');
    expect(payload.order_lines).toContain('Elysium');
    expect(payload.order_lines).toContain('5ml');
    expect(payload.order_lines).toContain('Montale');
    // 2 x $13.00 = $26.00 line total present somewhere
    expect(payload.order_lines).toContain('$26.00');
  });

  it('includes machine-readable totals', () => {
    expect(payload.subtotal).toBe('$31.00');
    expect(payload.shipping).toBe('$6.00');
    expect(payload.grand_total).toBe('$37.00');
    expect(payload.order_json).toContain('"orderNumber":"VA-ABC123"');
  });
});
