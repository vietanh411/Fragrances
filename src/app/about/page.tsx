import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { buttonClasses } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About & FAQ',
  description: 'What a decant is, how VA Decants works, payment, and shipping.',
};

const FAQS = [
  {
    q: 'What is a decant?',
    a: 'A decant is a smaller amount of a fragrance, hand-poured from a genuine full-size bottle into a clean vial. It lets you experience a scent properly — over a full day, on your own skin — before committing to (and paying for) an entire bottle.',
  },
  {
    q: 'Are these authentic?',
    a: 'Yes. Every decant is filled from an authentic, retail bottle. We never reformulate, dilute, or mix. The “Dupe” section features affordable houses inspired by famous originals — these are labelled clearly with the scent they’re inspired by.',
  },
  {
    q: 'How does payment work?',
    a: `Choose your decants, then check out by entering your details and selecting a payment method — ${siteConfig.payments
      .map((p) => p.method)
      .join(', ')}. Your order is sent to us, and you send the total using the handle shown, with your order number in the note. We ship once payment is received.`,
  },
  {
    q: 'What about shipping?',
    a: `Shipping is a flat $${siteConfig.shipping.flatRate} for orders under $${siteConfig.shipping.freeThreshold}, and free above $${siteConfig.shipping.freeThreshold}. ${siteConfig.turnaround}`,
  },
  {
    q: 'What sizes can I get, and what are the bottles like?',
    a: `Most fragrances are offered in 2ml, 5ml, 10ml, and 30ml (availability varies by scent). ${siteConfig.bottleNote}`,
  },
  {
    q: 'Do you offer bundles?',
    a: siteConfig.bundleNote,
  },
];

export default function AboutPage() {
  return (
    <div className="container-luxe py-16">
      <div className="mx-auto max-w-2xl">
        <p className="micro-label">About {siteConfig.brandName}</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-champagne md:text-6xl">
          On Decants
        </h1>
        <div className="gilt-rule my-8" />
        <p className="text-lg leading-relaxed text-muted">{siteConfig.shortPitch}</p>

        <div className="mt-12 space-y-10">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h2 className="font-display text-2xl text-champagne">{f.q}</h2>
              <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-[var(--line)] bg-ink-850 p-7 text-center">
          <p className="font-display text-2xl text-champagne">Questions before you buy?</p>
          <p className="mt-2 text-sm text-muted">
            Message us any time — we’re happy to recommend something for you.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${siteConfig.contactEmail}`} className={buttonClasses({})}>
              Email us
            </a>
            <Link href="/catalog" className={buttonClasses({ variant: 'ghost' })}>
              Explore the Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
