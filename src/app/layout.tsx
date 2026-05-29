import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site.config';
import { CartProvider } from '@/store/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} — Luxury Fragrance Decants`,
    template: `%s · ${siteConfig.brandName}`,
  },
  description: siteConfig.shortPitch,
  openGraph: {
    title: `${siteConfig.brandName} — Luxury Fragrance Decants`,
    description: siteConfig.shortPitch,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-champagne"
        >
          Skip to content
        </a>
        <CartProvider>
          <GrainOverlay />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
