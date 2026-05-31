'use client';

import { useState } from 'react';
import type { Product, SizeKey } from '@/lib/types';
import { useCart } from '@/store/cart-context';
import { SizeChips } from './SizeChips';
import { QuantityStepper } from './QuantityStepper';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/price';
import { CheckIcon } from '@/components/ui/icons';

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<SizeKey>(product.sizes[0]?.size ?? '2ml');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = product.sizes.find((s) => s.size === size) ?? product.sizes[0];
  const stock = selected?.stock ?? 0;
  const inStock = product.available && stock > 0;

  function handleSize(next: SizeKey) {
    setSize(next);
    const nextStock = product.sizes.find((s) => s.size === next)?.stock ?? 1;
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, nextStock)));
  }

  function handleAdd() {
    if (!inStock || !selected) return;
    addItem(product, selected.size, qty);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1600);
  }

  if (product.sizes.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="micro-label">Select a size</p>
        <SizeChips options={product.sizes} value={size} onChange={handleSize} />
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="micro-label">Quantity</p>
            {inStock && (
              <span className="text-xs text-muted">
                In stock: <span className="text-champagne tabular-nums">{stock}</span>
              </span>
            )}
          </div>
          <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, stock)} />
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted">{selected?.size} · {qty} × {formatPrice(selected?.price ?? 0)}</p>
          <p className="font-display text-3xl text-champagne tabular-nums">
            {formatPrice((selected?.price ?? 0) * qty)}
          </p>
        </div>
      </div>

      <Button
        variant={added ? 'solid' : 'gold'}
        size="lg"
        className="w-full"
        disabled={!inStock}
        onClick={handleAdd}
      >
        {!inStock ? (
          'Sold out'
        ) : added ? (
          <>
            <CheckIcon width={16} height={16} /> Added to your selection
          </>
        ) : (
          'Add to Selection'
        )}
      </Button>
    </div>
  );
}
