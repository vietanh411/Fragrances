import Link from 'next/link';

interface Props {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeading({ eyebrow, title, href, linkLabel = 'View all' }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="micro-label mb-2">{eyebrow}</p>}
        <h2 className="font-display text-4xl text-champagne md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="micro-label whitespace-nowrap !text-gold-300 transition-colors hover:!text-gold-400"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
