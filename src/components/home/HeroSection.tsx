import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { buttonClasses } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
      {/* gold radial spotlight */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.18), transparent 65%)' }}
        aria-hidden="true"
      />
      {/* faint monogram watermark */}
      <span
        className="pointer-events-none absolute select-none font-display text-champagne/[0.03]"
        style={{ fontSize: 'min(48vw, 40rem)', lineHeight: 1 }}
        aria-hidden="true"
      >
        VA
      </span>

      <div className="container-luxe relative z-10 flex flex-col items-center text-center">
        <p className="micro-label animate-fade-rise">Niche &amp; Designer, by the Millilitre</p>
        <h1
          className="mt-6 max-w-4xl animate-fade-rise font-display text-[clamp(2.75rem,8vw,6rem)] font-medium leading-[1.02] text-champagne"
          style={{ animationDelay: '80ms' }}
        >
          {siteConfig.brandName}
        </h1>
        <p
          className="mt-5 max-w-xl animate-fade-rise text-balance text-base leading-relaxed text-muted md:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          {siteConfig.tagline}
        </p>
        <div
          className="mt-9 flex animate-fade-rise flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '240ms' }}
        >
          <Link href="/catalog" className={buttonClasses({ size: 'lg' })}>
            Explore the Collection
          </Link>
          <Link href="/about" className={buttonClasses({ variant: 'ghost', size: 'lg' })}>
            What&rsquo;s a decant?
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="gilt-rule w-24" />
      </div>
    </section>
  );
}
