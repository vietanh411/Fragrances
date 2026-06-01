import Image from 'next/image';
import { getBrandVisual } from '@/lib/productVisual';

interface Props {
  brand: string;
  imageUrl?: string | null;
  size?: number;
}

/** Gilt-framed thumbnail for the cart/checkout: real product photo if available,
 *  otherwise a brand monogram tile. */
export function CartThumb({ brand, imageUrl, size = 56 }: Props) {
  const v = getBrandVisual(brand);
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-sm"
      style={{
        width: size,
        height: size,
        background: imageUrl ? '#f4efe6' : `linear-gradient(${v.angle}deg, ${v.from}, ${v.to})`,
      }}
      aria-hidden="true"
    >
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center font-display text-champagne/25"
          style={{ fontSize: size * 0.5 }}
        >
          {v.monogram}
        </span>
      )}
      <div className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-[rgba(201,162,75,0.3)]" />
    </div>
  );
}
