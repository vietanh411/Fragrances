import { siteConfig } from '@/config/site.config';
import { formatPrice } from '@/lib/price';
import { amountToFreeShipping } from '@/store/cart-math';

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const { flatRate, freeThreshold } = siteConfig.shipping;
  const remaining = amountToFreeShipping(subtotal, { flatRate, freeThreshold });
  const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const reached = remaining <= 0 && subtotal > 0;

  return (
    <div className="space-y-2">
      <p className="text-xs tracking-wide text-muted">
        {subtotal === 0 ? (
          <>Free shipping over {formatPrice(freeThreshold)}.</>
        ) : reached ? (
          <span className="text-success">✦ Complimentary shipping unlocked.</span>
        ) : (
          <>
            You&rsquo;re <span className="text-gold-300">{formatPrice(remaining)}</span> from
            complimentary shipping.
          </>
        )}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full transition-all duration-500 ease-luxe"
          style={{
            width: `${pct}%`,
            background: reached ? 'var(--success, #7FB069)' : 'var(--grad-gold)',
          }}
        />
      </div>
    </div>
  );
}
