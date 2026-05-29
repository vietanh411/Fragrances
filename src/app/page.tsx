import Link from 'next/link';
import { getProductData } from '@/lib/products';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustBand } from '@/components/home/TrustBand';
import { SectionHeading } from '@/components/home/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCard } from '@/components/product/ProductCard';
import { StaleBanner } from '@/components/layout/StaleBanner';
import { buttonClasses } from '@/components/ui/Button';

export const revalidate = 60;

const FEATURED_BRANDS = ['Roja Dove', 'Louis Vuitton', 'WA:IT', 'Nishane', 'Guerlain', 'Lattafa Perfumes'];

export default async function HomePage() {
  const data = await getProductData();
  const { products } = data;

  const featured = FEATURED_BRANDS.map((b) => products.find((p) => p.brand === b))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);
  const featuredList = featured.length >= 4 ? featured : products.slice(0, 4);

  const preview = products.slice(0, 8);

  return (
    <>
      {data.source === 'fallback' && <StaleBanner />}
      <HeroSection />
      <TrustBand />

      {featuredList.length > 0 && (
        <section className="container-luxe py-12">
          <SectionHeading eyebrow="Curated Selection" title="House Favourites" href="/catalog" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {featuredList.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container-luxe py-12">
        <SectionHeading
          eyebrow={`${products.length} fragrances`}
          title="The Collection"
          href="/catalog"
          linkLabel="Browse all"
        />
        <ProductGrid products={preview} />
        <div className="mt-12 flex justify-center">
          <Link href="/catalog" className={buttonClasses({ size: 'lg' })}>
            View the full collection
          </Link>
        </div>
      </section>
    </>
  );
}
