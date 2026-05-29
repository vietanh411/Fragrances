import { getBrandVisual } from '@/lib/productVisual';

/** Small gilt-framed monogram tile standing in for a product photo in the cart. */
export function CartThumb({ brand, size = 56 }: { brand: string; size?: number }) {
  const v = getBrandVisual(brand);
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-sm"
      style={{ width: size, height: size, background: `linear-gradient(${v.angle}deg, ${v.from}, ${v.to})` }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 flex items-center justify-center font-display text-champagne/25" style={{ fontSize: size * 0.5 }}>
        {v.monogram}
      </span>
      <div className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-[rgba(201,162,75,0.3)]" />
    </div>
  );
}
