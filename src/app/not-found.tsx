import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="micro-label">Error 404</p>
      <h1 className="mt-4 font-display text-6xl text-champagne">Lost the scent</h1>
      <p className="mt-3 max-w-sm text-muted">
        We couldn&rsquo;t find that page. It may have sold out or moved.
      </p>
      <Link href="/catalog" className={buttonClasses({ className: 'mt-8' })}>
        Back to the Collection
      </Link>
    </div>
  );
}
