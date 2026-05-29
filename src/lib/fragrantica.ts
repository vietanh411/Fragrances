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
