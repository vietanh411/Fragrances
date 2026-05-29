'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart-context';
import { FormField } from './FormField';
import { PaymentMethods } from './PaymentMethods';
import { Button } from '@/components/ui/Button';
import {
  buildWeb3FormsPayload,
  submitOrder,
  makeOrderNumber,
  type CheckoutCustomer,
} from '@/lib/checkout';
import { web3formsKey, hasWeb3formsKey } from '@/lib/env';
import { saveLastOrder } from '@/lib/order';
import { siteConfig } from '@/config/site.config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutForm() {
  const router = useRouter();
  const { items, totals, clear } = useCart();

  const [form, setForm] = useState({ name: '', email: '', instagram: '', address: '' });
  const [method, setMethod] = useState(siteConfig.payments[0].method as string);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.address.trim()) e.address = 'Please enter your shipping address.';
    if (!confirmed) e.confirm = 'Please confirm you will send payment.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const customer: CheckoutCustomer = {
      name: form.name.trim(),
      email: form.email.trim(),
      instagram: form.instagram.trim(),
      address: form.address.trim(),
    };
    const orderNumber = makeOrderNumber();
    const payload = buildWeb3FormsPayload({
      items,
      totals,
      customer,
      accessKey: web3formsKey(),
      orderNumber,
    });
    // Tell the owner which method the customer chose.
    payload.subject = `${payload.subject} · via ${method}`;

    if (hasWeb3formsKey()) {
      setSubmitting(true);
      const res = await submitOrder(payload);
      setSubmitting(false);
      if (!res.ok) {
        setSubmitError(res.message);
        return; // keep the cart so they can retry
      }
    }

    saveLastOrder({
      orderNumber,
      items,
      totals,
      customer,
      method,
      createdAt: new Date().toISOString(),
    });
    clear();
    router.push('/checkout/confirmation');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      <section>
        <h2 className="mb-4 font-display text-2xl text-champagne">
          <span className="mr-2 text-gold-500">1.</span> Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" name="name" value={form.name} onChange={set('name')} error={errors.name} required autoComplete="name" />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
          <FormField label="Instagram (optional)" name="instagram" value={form.instagram} onChange={set('instagram')} placeholder="@handle" className="sm:col-span-2" />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl text-champagne">
          <span className="mr-2 text-gold-500">2.</span> Shipping
        </h2>
        <FormField
          label="Shipping address"
          name="address"
          value={form.address}
          onChange={set('address')}
          error={errors.address}
          required
          placeholder="Street, city, state, ZIP, country"
          autoComplete="street-address"
        />
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl text-champagne">
          <span className="mr-2 text-gold-500">3.</span> Payment
        </h2>
        <p className="mb-4 text-sm text-muted">
          Choose how you&rsquo;ll pay. After placing your order, send the total using the details
          shown and include your order number.
        </p>
        <PaymentMethods amount={totals.grandTotal} value={method} onChange={setMethod} />
      </section>

      <section>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--gold-500)]"
            aria-invalid={!!errors.confirm}
          />
          <span>
            I&rsquo;ll send payment using the method above and include my order number in the note.
          </span>
        </label>
        {errors.confirm && <p className="mt-1 text-xs text-danger">{errors.confirm}</p>}
      </section>

      {submitError && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          <p className="font-medium">We couldn&rsquo;t submit your order.</p>
          <p className="mt-1 text-danger/80">{submitError}</p>
          <p className="mt-2 text-muted">
            Please try again, or email your order to{' '}
            <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Placing order…' : 'Place Order'}
      </Button>
    </form>
  );
}
