'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart-context';
import { BagIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/components/ui/cn';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const { totals, openCart, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-luxe',
        scrolled
          ? 'border-b border-[var(--line)] bg-ink-900/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-luxe flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-baseline gap-2" aria-label={`${siteConfig.brandName} home`}>
          <span className="font-display text-2xl tracking-wide text-champagne md:text-3xl">
            {siteConfig.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="micro-label !text-paper/70 transition-colors hover:!text-champagne"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="group relative flex items-center gap-2 rounded px-2 py-1.5 text-paper/80 transition-colors hover:text-champagne"
          aria-label={`Open cart, ${totals.itemCount} item${totals.itemCount === 1 ? '' : 's'}`}
        >
          <BagIcon />
          <span className="micro-label hidden !text-[0.62rem] sm:inline">Cart</span>
          {hydrated && totals.itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[0.62rem] font-medium text-ink-900 tabular-nums">
              {totals.itemCount}
            </span>
          )}
        </button>
      </div>

      {/* mobile nav */}
      <nav
        className="flex items-center justify-center gap-8 border-t border-[var(--line)] bg-ink-900/85 py-2.5 backdrop-blur-md md:hidden"
        aria-label="Primary mobile"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="micro-label !text-[0.62rem] !text-paper/70 hover:!text-champagne"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
