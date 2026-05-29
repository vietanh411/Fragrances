import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getProductVisual } from '@/lib/productVisual';
import { cn } from '@/components/ui/cn';

/** Three gold-stroked flacon glyphs, chosen per product for variety. */
function Glyph({ variant }: { variant: 0 | 1 | 2 }) {
  const common = {
    fill: 'none',
    stroke: 'var(--gold-300)',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (variant === 0) {
    // Classic flacon
    return (
      <svg viewBox="0 0 40 56" width="100%" height="100%" {...common}>
        <path d="M16 6h8v5l3 3v33a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V14l3-3V6Z" />
        <path d="M15 4h10v2H15z" />
        <path d="M13 24h14" opacity="0.5" />
      </svg>
    );
  }
  if (variant === 1) {
    // Dropper / vial
    return (
      <svg viewBox="0 0 40 56" width="100%" height="100%" {...common}>
        <path d="M17 4h6v8l2 4v30a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V16l2-4V4Z" />
        <path d="M16 4h8" />
        <path d="M20 22v18" opacity="0.5" />
      </svg>
    );
  }
  // Rounded atomizer
  return (
    <svg viewBox="0 0 40 56" width="100%" height="100%" {...common}>
      <rect x="14" y="6" width="12" height="6" rx="1.5" />
      <path d="M13 14c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v30a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V14Z" />
      <circle cx="20" cy="30" r="5" opacity="0.5" />
    </svg>
  );
}

interface ProductMotifProps {
  product: Product;
  /** Visual scale; affects monogram/glyph sizing. */
  scale?: 'card' | 'hero';
  className?: string;
}

/**
 * The "fragrance plate": a gilt-framed art panel standing in for product
 * photography. If the product has a real imageUrl, the photo fills the same
 * frame instead — zero layout change.
 */
export function ProductMotif({ product, scale = 'card', className }: ProductMotifProps) {
  const v = getProductVisual(product);
  const dimmed = !product.available;

  return (
    <div
      className={cn(
        'relative aspect-[4/5] w-full overflow-hidden rounded-md',
        dimmed && 'saturate-[0.35]',
        className,
      )}
      aria-hidden="true"
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(max-width:768px) 50vw, 320px"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(${v.angle}deg, ${v.from}, ${v.to})` }}
        />
      )}

      {/* grain + vignette */}
      <div className="grain-overlay !absolute !z-0 opacity-[0.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,transparent,rgba(0,0,0,0.45))]" />

      {!product.imageUrl && (
        <>
          {/* monogram watermark */}
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-display font-medium text-champagne/[0.10] select-none"
            style={{ fontSize: scale === 'hero' ? '13rem' : '7rem', lineHeight: 1 }}
          >
            {v.monogram}
          </span>
          {/* flacon glyph, lower-right */}
          <div
            className={cn(
              'absolute bottom-4 right-4 opacity-70',
              scale === 'hero' ? 'h-24 w-16' : 'h-14 w-10',
            )}
          >
            <Glyph variant={v.glyph} />
          </div>
        </>
      )}

      {/* inset gilt hairline frame */}
      <div className="pointer-events-none absolute inset-[10px] rounded-sm border border-[rgba(201,162,75,0.28)]" />

      {/* wax-seal style stamp, lower-left */}
      <span className="absolute bottom-4 left-4 micro-label !text-[0.55rem] !tracking-[0.2em] text-gold-300/80">
        VA · DECANTS
      </span>
    </div>
  );
}
