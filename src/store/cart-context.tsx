'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CartItem, CartTotals, Product, SizeKey } from '@/lib/types';
import { totalsFor, lineKey } from '@/store/cart-math';
import { siteConfig } from '@/config/site.config';

const STORAGE_KEY = 'va-decants-cart-v1';

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: SizeKey, qty?: number) => void;
  updateQty: (productId: string, size: SizeKey, qty: number) => void;
  removeItem: (productId: string, size: SizeKey) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const shipping = {
  flatRate: siteConfig.shipping.flatRate,
  freeThreshold: siteConfig.shipping.freeThreshold,
};

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const justAdded = useRef(false);

  // Load persisted cart after mount (SSR-safe).
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration so we don't clobber storage).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable (private mode / quota) — ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, size: SizeKey, qty = 1) => {
    const option = product.sizes.find((s) => s.size === size);
    if (!option) return;
    setItems((prev) => {
      const key = lineKey(product.id, size);
      const cap = option.stock ?? 99;
      const existing = prev.find((i) => lineKey(i.productId, i.size) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.productId, i.size) === key
            ? { ...i, qty: Math.min(i.qty + qty, cap), stock: option.stock }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          brand: product.brand,
          name: product.name,
          size,
          unitPrice: option.price,
          qty,
          imageUrl: product.imageUrl,
          stock: option.stock,
        },
      ];
    });
    justAdded.current = true;
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, size: SizeKey, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.size === size ? { ...i, qty: Math.max(0, qty) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string, size: SizeKey) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(() => totalsFor(items, shipping), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      hydrated,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQty,
      removeItem,
      clear,
    }),
    [items, totals, hydrated, isOpen, openCart, closeCart, addItem, updateQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
