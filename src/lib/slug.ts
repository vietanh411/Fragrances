// Stable, url-safe slugs derived from a product's brand + name.

/** Fold accents, drop punctuation, and kebab-case a string. */
function slugify(input: string): string {
  return input
    .normalize('NFD') // split accented chars into base + combining mark
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks (é -> e)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // drop punctuation entirely (d'Orange -> dorange, WA:IT -> wait)
    .trim()
    .replace(/\s+/g, '-'); // whitespace runs -> single hyphen
}

/** Build a slug like "louis-vuitton-afternoon-swim" from brand + name. */
export function toSlug(brand: string, name: string): string {
  return slugify(`${brand} ${name}`);
}
