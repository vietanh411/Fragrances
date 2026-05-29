import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { FacebookIcon, InstagramIcon } from '@/components/ui/icons';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--line)] bg-ink-850">
      <div className="container-luxe grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-champagne">{siteConfig.brandName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.shortPitch}</p>
          <div className="mt-5 flex items-center gap-3">
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted transition-colors hover:text-gold-300"
              >
                <InstagramIcon />
              </a>
            )}
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted transition-colors hover:text-gold-300"
              >
                <FacebookIcon />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="micro-label mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/catalog" className="transition-colors hover:text-champagne">The Collection</Link></li>
            <li><Link href="/catalog?category=Niche" className="transition-colors hover:text-champagne">Niche</Link></li>
            <li><Link href="/catalog?category=Designer" className="transition-colors hover:text-champagne">Designer</Link></li>
            <li><Link href="/catalog?category=Dupe" className="transition-colors hover:text-champagne">Dupes</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-champagne">About &amp; FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="micro-label mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className="transition-colors hover:text-champagne">
                {siteConfig.contactEmail}
              </a>
            </li>
            <li className="text-muted-2">{siteConfig.turnaround}</li>
          </ul>
        </div>
      </div>

      <div className="container-luxe flex flex-col gap-2 border-t border-[var(--line)] py-6 text-xs text-muted-2 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.brandName}. Hand-decanted from authentic bottles.</p>
        <p>Payment by Venmo · PayPal · Zelle · CashApp</p>
      </div>
    </footer>
  );
}
