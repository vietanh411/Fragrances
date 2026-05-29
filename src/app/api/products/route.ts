import { NextResponse } from 'next/server';
import { getProductData } from '@/lib/products';

export const revalidate = 60;

// Normalized product data as JSON. Used by the cart page to reconcile stale
// localStorage items and available for debugging the live parse.
export async function GET() {
  const data = await getProductData();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
  });
}
