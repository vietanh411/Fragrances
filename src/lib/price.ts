// Parsing and formatting for the sheet's currency cells.
//
// The Google Sheet stores prices with a COMMA decimal separator ("$4,00" = $4.00).
// We tolerate a period separator too, in case the owner changes locale later.

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Parse a price cell into a number of dollars, or null if blank/unparseable.
 *   "$4,00"  -> 4
 *   "$10,99" -> 10.99
 *   "$12.50" -> 12.5
 *   ""       -> null
 *   "🔗 Link" -> null
 */
export function parsePrice(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  // Strip everything except digits, comma, and period.
  const cleaned = raw.replace(/[^\d.,]/g, '').trim();
  if (cleaned === '') return null;

  let normalized = cleaned;
  // "4,00" -> treat comma as decimal separator.
  if (/^\d+,\d{1,2}$/.test(cleaned)) {
    normalized = cleaned.replace(',', '.');
  } else {
    // Otherwise commas are thousands separators ("1,234.56").
    normalized = cleaned.replace(/,/g, '');
  }

  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

/** Format a dollar amount as US currency, e.g. 4 -> "$4.00". */
export function formatPrice(value: number): string {
  return usd.format(value);
}
