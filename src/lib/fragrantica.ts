// The sheet's "Fragrantica" cells lose their real URLs in CSV export (every cell
// is literally "🔗 Link"). As a reliable fallback we build a Google search scoped
// to fragrantica.com, which lands the user on the right note breakdown.
//
// If the owner later adds a real "Fragrantica URL" column, the parser prefers it
// and this fallback is only used when that column is absent/blank.

/** Remove a trailing parenthetical (e.g. a "dupe of …" note) for cleaner searches. */
export function stripParenthetical(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** Build a deterministic Google site-search URL for a fragrance. */
export function buildFragranticaUrl(brand: string, name: string): string {
  const query = `site:fragrantica.com ${brand} ${stripParenthetical(name)}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Derive the Fragrantica product image (fimgs.net CDN) from a perfume page URL.
 * The trailing number in the URL is the image id, e.g.
 *   .../Khamrah-75805.html -> https://fimgs.net/mdimg/perfume/375x500.75805.jpg
 */
export function fragranticaImageFromUrl(url: string): string | null {
  const match = url.match(/-(\d+)\.html$/);
  return match ? `https://fimgs.net/mdimg/perfume/375x500.${match[1]}.jpg` : null;
}
