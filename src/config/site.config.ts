// ─────────────────────────────────────────────────────────────────────────────
// VA Decants — site configuration
//
// This is the ONE file a non-technical owner edits in code. Everything here is
// non-secret. Secrets (Google Sheet ID/GID, Web3Forms key) live in .env — see
// .env.example.
//
//  ⚠ BEFORE GOING LIVE: replace the payment handles below with your real ones.
// ─────────────────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  method: 'Venmo' | 'PayPal' | 'Zelle' | 'CashApp';
  /** Your handle / username / email as the customer should send it. */
  handle: string;
  /** Optional deep link to your pay page (leave '' to hide the button). */
  link: string;
  /** Optional QR image placed in /public (e.g. "/qr/venmo.png"); '' to hide. */
  qr: string;
}

export const siteConfig = {
  brandName: 'VA Decants',
  tagline: 'Discover the world’s finest fragrances — in sizes worth exploring.',
  shortPitch:
    'Niche, designer, and dupe fragrances hand-decanted into 2ml–30ml bottles, so you can try before you commit to a full bottle.',

  // Contact (pulled from your sheet — change anytime).
  contactEmail: 'vanhnguyenn411@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/viet.anh.nguyen.429130',
    instagram: '', // add your Instagram URL to show the icon
  },

  // Shipping (from your sheet: "$6 under $50, free over $50").
  shipping: {
    flatRate: 6,
    freeThreshold: 50,
    currency: 'USD',
  },

  // Friendly notes shown on the About/FAQ page and product details.
  bottleNote:
    '2ml samples come in plastic bottles. 5ml, 10ml, and 30ml come in thick glass bottles.',
  bundleNote: 'Ask about bundle pricing — message me for a custom set.',
  turnaround: 'Orders are hand-decanted and shipped within 1–2 business days of payment.',

  //  ⚠ Replace these placeholders with your real handles before accepting orders.
  payments: [
    { method: 'Venmo', handle: '@your-venmo', link: 'https://venmo.com/u/your-venmo', qr: '' },
    { method: 'PayPal', handle: 'you@example.com', link: 'https://paypal.me/yourhandle', qr: '' },
    { method: 'Zelle', handle: 'your-zelle-email-or-phone', link: '', qr: '' },
    { method: 'CashApp', handle: '$yourcashtag', link: 'https://cash.app/$yourcashtag', qr: '' },
  ] satisfies PaymentMethod[],
} as const;

export type SiteConfig = typeof siteConfig; 
