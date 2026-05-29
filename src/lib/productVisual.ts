// Deterministic per-product art, derived from the brand so every card looks
// designed (and brand-consistent) even though we have no product photography.

import type { Product } from '@/lib/types';

/** cyrb53 — a fast, well-distributed 53-bit string hash. */
function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Curated, muted, luxe gradient duos (deep jewel tones on near-black). */
const PALETTES: { from: string; to: string }[] = [
  { from: '#0e3b2e', to: '#16241f' }, // emerald
  { from: '#3a1418', to: '#1d1012' }, // oxblood
  { from: '#142844', to: '#101725' }, // sapphire
  { from: '#2a1430', to: '#17101c' }, // plum
  { from: '#3a2a14', to: '#1d160e' }, // bronze
  { from: '#103231', to: '#0f1d1c' }, // slate-teal
];

export interface ProductVisual {
  from: string;
  to: string;
  monogram: string;
  glyph: 0 | 1 | 2;
  angle: number;
}

/** Brand initials, 1–2 letters, for the watermark monogram. */
function monogramOf(brand: string): string {
  const words = brand.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'VA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Visual derived from a brand name alone (used by cards and cart thumbnails). */
export function getBrandVisual(brand: string): ProductVisual {
  const h = cyrb53(brand);
  const palette = PALETTES[h % PALETTES.length];
  return {
    ...palette,
    monogram: monogramOf(brand),
    glyph: (Math.floor(h / 7) % 3) as 0 | 1 | 2,
    angle: 130 + (h % 50), // 130–180deg, subtle variation
  };
}

export function getProductVisual(product: Product): ProductVisual {
  return getBrandVisual(product.brand);
}
