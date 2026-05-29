// Turn the raw Google Sheet CSV into normalized Product data.
//
// The sheet is NOT a single table. From top to bottom it contains:
//   • banner/metadata rows (title, shipping, notes, contact)
//   • a "── SECTION ──" divider, then a header row, then product rows
//   • repeated for sections NICHE / DESIGNER / DUPE (each re-prints the header)
// We track the current category, map columns by header NAME (so a future added
// column like "Image" still works), and skip everything that isn't a product.

import { parseCsv } from '@/lib/csv';
import { parsePrice } from '@/lib/price';
import { toSlug } from '@/lib/slug';
import { buildFragranticaUrl, stripParenthetical } from '@/lib/fragrantica';
import {
  SIZE_ORDER,
  type Category,
  type Gender,
  type Product,
  type ProductData,
  type SizeKey,
  type SizeOption,
} from '@/lib/types';

const GENDERS: Gender[] = ['Male', 'Female', 'Unisex'];
const DIVIDER = /──\s*(.+?)\s*──/;

function toCategory(label: string): Category {
  const l = label.trim().toLowerCase();
  if (l.startsWith('niche')) return 'Niche';
  if (l.startsWith('designer')) return 'Designer';
  if (l.startsWith('dupe')) return 'Dupe';
  return 'Other';
}

function isHeaderRow(row: string[]): boolean {
  return row[0]?.trim().toLowerCase() === 'brand' && row[1]?.trim().toLowerCase() === 'name';
}

function isBlankRow(row: string[]): boolean {
  return row.every((cell) => cell.trim() === '');
}

/** Build a header-name → column-index map from a header row. */
function columnMap(header: string[]): Map<string, number> {
  const map = new Map<string, number>();
  header.forEach((label, i) => map.set(label.trim().toLowerCase(), i));
  return map;
}

function cellByName(row: string[], cols: Map<string, number>, name: string): string {
  const idx = cols.get(name.toLowerCase());
  if (idx == null) return '';
  return (row[idx] ?? '').trim();
}

export function parseProducts(csvText: string): ProductData {
  const rows = parseCsv(csvText);
  const products: Product[] = [];
  const errors: string[] = [];
  const categoriesSeen: Category[] = [];
  const usedIds = new Set<string>();

  let currentCategory: Category = 'Other';
  let cols: Map<string, number> | null = null;

  for (const row of rows) {
    if (isBlankRow(row)) {
      continue;
    }

    const firstCell = row[0]?.trim() ?? '';

    // Section divider → switch category.
    const dividerMatch = firstCell.match(DIVIDER);
    if (dividerMatch) {
      currentCategory = toCategory(dividerMatch[1]);
      if (currentCategory !== 'Other' && !categoriesSeen.includes(currentCategory)) {
        categoriesSeen.push(currentCategory);
      }
      cols = null; // a fresh header row will follow
      continue;
    }

    // Header row → capture the column layout, then skip.
    if (isHeaderRow(row)) {
      cols = columnMap(row);
      continue;
    }

    // Without a header we have no column layout yet → this is a banner row.
    if (!cols) {
      continue;
    }

    const brand = cellByName(row, cols, 'brand');
    const name = cellByName(row, cols, 'name');
    const genderRaw = cellByName(row, cols, 'gender');

    // A product row must have a brand, a name, and a recognizable gender.
    const isProduct = brand !== '' && name !== '' && GENDERS.includes(genderRaw as Gender);
    if (!isProduct) {
      // Quietly skip leftover banner-ish rows; only warn if it looked like a product.
      if (brand !== '' && name !== '') {
        errors.push(`Skipped "${brand} ${name}": unrecognized gender "${genderRaw}".`);
      }
      continue;
    }

    const gender = genderRaw as Gender;
    const available = cellByName(row, cols, 'available?').toLowerCase() === 'yes';

    const sizes: SizeOption[] = [];
    for (const size of SIZE_ORDER) {
      const price = parsePrice(cellByName(row, cols, size));
      if (price != null) sizes.push({ size: size as SizeKey, price });
    }

    if (sizes.length === 0) {
      errors.push(`Skipped "${brand} ${name}": no valid prices.`);
      continue;
    }

    const inspiredByMatch = name.match(/\(([^)]+)\)\s*$/);
    const inspiredBy = inspiredByMatch ? inspiredByMatch[1].trim() : null;

    // Prefer a real Fragrantica URL column if the owner adds one; else fall back.
    const fragranticaCell = cellByName(row, cols, 'fragrantica url');
    const fragranticaUrl = /^https?:\/\//.test(fragranticaCell)
      ? fragranticaCell
      : buildFragranticaUrl(brand, stripParenthetical(name));

    const imageCell = cellByName(row, cols, 'image');
    const imageUrl = /^https?:\/\//.test(imageCell) ? imageCell : null;

    let id = toSlug(brand, name);
    if (usedIds.has(id)) {
      let n = 2;
      while (usedIds.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }
    usedIds.add(id);

    products.push({
      id,
      brand,
      name,
      gender,
      category: currentCategory,
      available,
      sizes,
      inspiredBy,
      fragranticaUrl,
      imageUrl,
    });
  }

  return {
    products,
    categories: categoriesSeen,
    source: 'live',
    fetchedAt: new Date().toISOString(),
    errors,
  };
}
