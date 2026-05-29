import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProducts, findProduct } from '@/lib/products';
import { ProductMotif } from '@/components/product/ProductMotif';
import { ProductCard } from '@/components/product/ProductCard';
import { AddToCartForm } from '@/components/product/AddToCartForm';
import { GenderPill, StockStatus } from '@/components/product/primitives';
import { ExternalIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return { title: 'Not found' };
  return {
    title: `${product.name} — ${product.brand}`,
    description: `${product.brand} ${product.name} fragrance decants from ${siteConfig.brandName}.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.gender === product.gender))
    .slice(0, 4);

  return (
    <div className="container-luxe py-10">
      <nav className="mb-8 text-xs text-muted-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-paper">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-paper">Collection</Link>
        <span className="mx-2">/</span>
        <span className="text-muted">{product.brand}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto max-w-md">
            <ProductMotif product={product} scale="hero" />
            <p className="mt-4 text-center text-xs text-muted-2">
              Hand-decanted to order · {siteConfig.bottleNote.split('.')[0]}.
            </p>
          </div>
        </div>

        <div>
          <p className="micro-label">{product.brand}</p>
          <h1 className="mt-2 font-display text-5xl leading-tight text-champagne md:text-6xl">
            {product.name}
          </h1>
          {product.inspiredBy && (
            <p className="mt-2 text-base italic text-muted">Inspired by {product.inspiredBy}</p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <GenderPill gender={product.gender} />
            <StockStatus available={product.available} />
            <span className="micro-label !text-muted-2">{product.category}</span>
          </div>

          <div className="gilt-rule my-7" />

          <AddToCartForm product={product} />

          <div className="mt-8 space-y-4 border-t border-[var(--line)] pt-6 text-sm leading-relaxed text-muted">
            <p>{siteConfig.bottleNote}</p>
            {product.fragranticaUrl && (
              <a
                href={product.fragranticaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-300 transition-colors hover:text-gold-400"
              >
                View the full note breakdown on Fragrantica
                <ExternalIcon width={15} height={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="gilt-rule mb-10" />
          <h2 className="mb-8 font-display text-3xl text-champagne">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
