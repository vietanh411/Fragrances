import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProductData, brandFacets } from '@/lib/products';
import { CatalogView } from '@/components/catalog/CatalogView';
import { ProductGridSkeleton } from '@/components/product/ProductGrid';
import { StaleBanner } from '@/components/layout/StaleBanner';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Collection',
  description: 'Browse the full VA Decants collection of niche, designer, and dupe fragrances.',
};

export default async function CatalogPage() {
  const data = await getProductData();
  const brands = brandFacets(data.products);

  return (
    <>
      {data.source === 'fallback' && <StaleBanner />}
      <div className="container-luxe pt-10">
        <p className="micro-label">The VA Decants Collection</p>
        <h1 className="mt-3 font-display text-5xl text-champagne md:text-6xl">Explore Every Scent</h1>
        <div className="gilt-rule mt-6 max-w-xs" />
      </div>
      <Suspense
        fallback={
          <div className="container-luxe py-10">
            <ProductGridSkeleton count={12} />
          </div>
        }
      >
        <CatalogView products={data.products} brands={brands} />
      </Suspense>
    </>
  );
}
