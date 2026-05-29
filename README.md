# VA Decants — Fragrance Decant Storefront

A luxury storefront for selling fragrance decants. The catalog syncs **live** from
your Google Sheet, customers add decants to a cart and check out, and each order is
**emailed to you** — customers then pay by Venmo / PayPal / Zelle / CashApp.

Built with Next.js (App Router) + TypeScript + Tailwind CSS. Deploys free on Vercel.

---

## How it works

- **Your Google Sheet is the database.** Add a row, change a price, or mark something
  sold out, and the website updates within ~1 minute — no code changes, no redeploy.
- **No card processing.** Checkout collects the customer's details and emails the order
  to you (via [Web3Forms](https://web3forms.com)). The customer is shown your payment
  handles and sends the total manually, with their order number in the note.
- **No product photos needed.** Each product gets a tasteful, auto-generated "fragrance
  plate" (a gilt-framed panel with the brand monogram). Add photos later if you want.

---

## Things you can change WITHOUT touching code

### 1. The Google Sheet (your live inventory)
- **Add a product:** add a row under the right section (`── NICHE ──`, `── DESIGNER ──`,
  or `── DUPE ──`) with Brand, Name, Gender (`Male`/`Female`/`Unisex`), `Available?` =
  `Yes`, and prices in the size columns you offer.
- **Change a price:** edit the cell (format like `$8,00`).
- **Mark sold out / hide:** set `Available?` to `No`.
- **Keep the layout:** don't delete the section dividers or the `Brand,Name,…` header rows.
- The Sheet must be shared **"Anyone with the link → Viewer"** (or File → Share → Publish
  to web). Test by opening the Sheet in a private browser window.
- **(Optional) Product photos:** add an `Image` column and paste a **public, hot-linkable**
  image URL per product. The site uses it automatically when present.

### 2. `src/config/site.config.ts` (everything branded)
Brand name, tagline, **payment handles**, shipping fee/threshold, contact email, social
links, and the FAQ notes all live here, with comments.

> ⚠ **Before accepting real orders, replace the placeholder payment handles** (Venmo,
> PayPal, Zelle, CashApp) with your real ones. To show QR codes, drop images in
> `public/qr/` (e.g. `public/qr/venmo.png`) and set the `qr` field for each method.

### 3. `.env.local` / Vercel environment variables (secrets)
See `.env.example`. Three values: `SHEET_ID`, `SHEET_GID`, `NEXT_PUBLIC_WEB3FORMS_KEY`.

---

## Local development

```bash
npm install
cp .env.example .env.local      # then edit if needed (Windows: copy .env.example .env.local)
npm run dev                     # http://localhost:3000
```

Other scripts:

```bash
npm test         # run the test suite (data parsing, cart math, checkout, etc.)
npm run build    # production build
npm start        # serve the production build locally
```

To refresh the offline fallback snapshot after big Sheet changes:

```bash
curl -L "https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<SHEET_GID>" -o tests/fixtures/sample-sheet.csv
node scripts/gen-fallback.mjs
```

---

## Deploying to Vercel (free)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
   Next.js is detected automatically — no build settings to change.
3. In **Settings → Environment Variables**, add `SHEET_ID`, `SHEET_GID`, and
   `NEXT_PUBLIC_WEB3FORMS_KEY`, then deploy.
4. You'll get a free `your-store.vercel.app` URL. (You can add a custom domain later.)

### Getting a Web3Forms key (so orders email you)
1. Go to [web3forms.com](https://web3forms.com), enter the email where you want orders
   delivered, and copy the **Access Key** they email you.
2. Put it in `NEXT_PUBLIC_WEB3FORMS_KEY` (locally in `.env.local`, and in Vercel).
   The free plan allows 250 orders/month. (Until a real key is set, checkout still works
   and shows payment instructions — it just won't email you the order.)

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Banner: "Live inventory temporarily unavailable" | The Sheet isn't publicly viewable. Re-share it as "Anyone with the link → Viewer". |
| Orders not arriving by email | Check `NEXT_PUBLIC_WEB3FORMS_KEY` is set, check spam, and confirm you're under the 250/month limit. |
| A product is missing from the site | It needs a Brand, a Name, a valid Gender, and at least one price. Rows missing these are skipped. |
| Prices look wrong | Use the `$8,00` format (comma) the Sheet already uses. |

---

## Project structure

```
src/
  app/            routes: home, /catalog, /product/[slug], /cart, /checkout,
                  /checkout/confirmation, /about, /api/products
  components/     layout, home, catalog, product, cart, checkout, ui
  lib/            data layer (sheet fetch, CSV parse, price, slug, fragrantica,
                  catalog filters, product visuals, checkout payload)
  store/          cart context + pure cart math + stale-cart reconciliation
  config/         site.config.ts  ← owner-facing settings
tests/            unit tests (Vitest) + the captured sheet fixture
```
