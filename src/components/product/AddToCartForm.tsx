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

  function handleAdd() {
    if (!product.available || !selected) return;
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
        <SizeChips options={product.sizes} value={size} onChange={setSize} />
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-3">
          <p className="micro-label">Quantity</p>
          <QuantityStepper value={qty} onChange={setQty} />
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
        disabled={!product.available}
        onClick={handleAdd}
      >
        {!product.available ? (
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
