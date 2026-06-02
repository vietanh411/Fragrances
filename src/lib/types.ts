// Core domain types for the VA Decants storefront.

export type SizeKey = '2ml' | '5ml' | '10ml' | '30ml';
export type Gender = 'Male' | 'Female' | 'Unisex';
export type Category = 'Niche' | 'Designer' | 'Dupe' | 'Other';

export const SIZE_ORDER: readonly SizeKey[] = ['2ml', '5ml', '10ml', '30ml'];

export interface SizeOption {
  size: SizeKey;
  /** Price in dollars, e.g. 4 for "$4,00". */
  price: number;
  /** Units available of this fragrance in this size. */
  stock: number;
}

export interface Product {
  /** Stable slug, e.g. "louis-vuitton-afternoon-swim". */
  id: string;
  brand: string;
  name: string;
  gender: Gender;
  category: Category;
  available: boolean;
  /** Only the sizes actually offered, sorted 2ml → 30ml. Never empty. */
  sizes: SizeOption[];
  /** For "Dupe" items, the original named in trailing parentheses, e.g. "God of Fire". */
  inspiredBy: string | null;
  /** Best-effort Fragrantica link (search URL fallback when no real URL exists). */
  fragranticaUrl: string | null;
  /** Optional product photo from a future "Image" column; null today. */
  imageUrl: string | null;
}

export interface ProductData {
  products: Product[];
  /** Distinct categories present, in display order. */
  categories: Category[];
  /** Whether products came from the live Sheet or the committed fallback snapshot. */
  source: 'live' | 'fallback';
  /** ISO timestamp of when the data was produced. */
  fetchedAt: string;
  /** Non-fatal parse warnings (skipped rows, bad prices, etc.). */
  errors: string[];
}

/** A single line in the cart — one product at one size. */
export interface CartItem {
  productId: string;
  brand: string;
  name: string;
  size: SizeKey;
  unitPrice: number;
  qty: number;
  /** Product photo for cart/checkout thumbnails; null/undefined → monogram tile. */
  imageUrl?: string | null;
  /** Units available of this size at the time it was added (caps cart quantity). */
  stock?: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  grandTotal: number;
  itemCount: number;
}

export interface ShippingConfig {
  flatRate: number;
  freeThreshold: number;
}
