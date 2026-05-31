import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/price';
import { ProductMotif } from './ProductMotif';
import { BrandLabel, GenderPill } from './primitives';
import { cn } from '@/components/ui/cn';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const lowest = product.sizes[0]?.price ?? 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'group relative flex flex-col rounded-lg border border-[var(--line)] bg-ink-800/60 p-3',
        'transition-all duration-300 ease-luxe hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-glow',
        'animate-fade-rise',
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <div className="relative">
        <ProductMotif product={product} />
        {!product.available && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-danger/50 bg-ink-900/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-danger">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1 pt-4 pb-1">
        <BrandLabel brand={product.brand} className="!text-[0.62rem]" />
        <h3 className="font-display text-xl leading-tight text-champagne line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <GenderPill gender={product.gender} />
          <span className="font-sans text-sm text-paper tabular-nums">
            <span className="text-muted-2 text-[0.7rem]">from </span>
            {formatPrice(lowest)}
          </span>
        </div>
      </div>
    </Link>
  );
}
