import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parseProducts } from '@/lib/parse';
import type { ProductData, Product } from '@/lib/types';

const fixturePath = path.resolve(process.cwd(), 'tests/fixtures/sample-sheet.csv');
const csv = readFileSync(fixturePath, 'utf8');

function find(data: ProductData, brand: string, namePart: string): Product | undefined {
  return data.products.find(
    (p) => p.brand === brand && p.name.toLowerCase().includes(namePart.toLowerCase()),
  );
}

describe('parseProducts (real sheet fixture)', () => {
  let data: ProductData;
  beforeAll(() => {
    data = parseProducts(csv);
  });

  it('parses every product across the three sections', () => {
    expect(data.products.length).toBe(46);
  });

  it('assigns categories from the section dividers', () => {
    expect(find(data, '27 87', 'Per Se')?.category).toBe('Niche');
    expect(find(data, 'Acqua di Parma', 'Buongiorno')?.category).toBe('Designer');
    expect(find(data, 'Lattafa Perfumes', 'Khamrah')?.category).toBe('Dupe');
    expect(data.categories).toEqual(['Niche', 'Designer', 'Dupe']);
  });

  it('excludes banner, divider, blank, and repeated header rows', () => {
    expect(data.products.some((p) => /VA DECANTS|SHIPPING|NOTES|CONTACT/i.test(p.brand))).toBe(
      false,
    );
    expect(data.products.some((p) => p.brand === 'Brand')).toBe(false);
    expect(data.products.some((p) => p.brand.trim() === '')).toBe(false);
  });

  it('keeps only the sizes that are actually offered', () => {
    const miu = find(data, 'Miu Miu', 'Fleur de Lait');
    expect(miu?.sizes.map((s) => s.size)).toEqual(['2ml']);
    expect(miu?.sizes[0].price).toBe(5);

    const waIt = find(data, 'WA:IT', 'Haru');
    expect(waIt?.sizes.map((s) => s.size)).toEqual(['2ml', '5ml', '10ml', '30ml']);
    expect(waIt?.sizes.find((s) => s.size === '30ml')?.price).toBe(55);
  });

  it('parses comma-decimal prices into numbers', () => {
    const perSe = find(data, '27 87', 'Per Se');
    expect(perSe?.sizes).toEqual([
      { size: '2ml', price: 4, stock: 1 },
      { size: '5ml', price: 7, stock: 1 },
    ]);
  });

  it('marks all current products available', () => {
    expect(data.products.every((p) => p.available)).toBe(true);
  });

  it('parses rows that are missing the trailing Fragrantica cell', () => {
    const bad = find(data, "Julianna's Perfumes", 'Bad Bitch');
    expect(bad).toBeDefined();
    expect(bad?.sizes.map((s) => s.size)).toEqual(['2ml', '5ml', '10ml']);
    const soi = find(data, 'Soi Parfums', 'Creamy Dream');
    expect(soi).toBeDefined();
  });

  it('extracts "inspiredBy" from a trailing parenthetical for dupes', () => {
    const opulent = find(data, 'Lattafa Perfumes', 'Opulent Dubai');
    expect(opulent?.inspiredBy).toBe('God of Fire');
    // Niche items without a parenthetical have no inspiredBy.
    expect(find(data, '27 87', 'Per Se')?.inspiredBy).toBeNull();
  });

  it('links every product to fragrantica (real page or search fallback)', () => {
    expect(data.products.every((p) => p.fragranticaUrl?.includes('fragrantica.com'))).toBe(true);
  });

  it('uses the real Fragrantica page + CDN photo for a known fragrance', () => {
    const khamrah = find(data, 'Lattafa Perfumes', 'Khamrah');
    expect(khamrah?.fragranticaUrl).toBe(
      'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-75805.html',
    );
    expect(khamrah?.imageUrl).toBe('https://fimgs.net/mdimg/perfume/375x500.75805.jpg');

    const swim = find(data, 'Louis Vuitton', 'Afternoon Swim');
    expect(swim?.imageUrl).toBe('https://fimgs.net/mdimg/perfume/375x500.53947.jpg');
  });

  it('falls back to a search link with no photo for unlisted dupes', () => {
    const bad = find(data, "Julianna's Perfumes", 'Bad Bitch');
    expect(bad?.imageUrl).toBeNull();
    expect(bad?.fragranticaUrl).toContain('google.com/search');
  });

  it('gives the vast majority of products a real photo', () => {
    const withPhotos = data.products.filter((p) => p.imageUrl?.includes('fimgs.net')).length;
    expect(withPhotos).toBeGreaterThanOrEqual(44);
  });

  it('generates url-safe slugs, including for apostrophe/accented brands', () => {
    expect(find(data, "Etat Libre d'Orange", 'Above the Waves')?.id).toBe(
      'etat-libre-dorange-above-the-waves',
    );
    expect(find(data, 'Veronique Gabai', 'Vert')?.id).toBe('veronique-gabai-vert-desir');
  });

  it('reports a live source and an ISO timestamp', () => {
    expect(data.source).toBe('live');
    expect(() => new Date(data.fetchedAt).toISOString()).not.toThrow();
  });

  it('picks up an optional Image column when present', () => {
    const withImage = `── NICHE ──
Brand,Name,Gender,Available?,2ml,5ml,10ml,30ml,Fragrantica,Image
Test Brand,Test Scent,Unisex,Yes,"$4,00","$8,00",,,🔗 Link,https://cdn.example.com/a.jpg`;
    const out = parseProducts(withImage);
    expect(out.products[0].imageUrl).toBe('https://cdn.example.com/a.jpg');
  });

  it('derives both link and photo from a sheet "Fragrantica URL" column (new rows)', () => {
    const csv = `── NICHE ──
Brand,Name,Gender,Available?,2ml,5ml,10ml,30ml,Fragrantica URL
New House,New Scent,Unisex,Yes,"$5,00",,,,https://www.fragrantica.com/perfume/New-House/New-Scent-99999.html`;
    const out = parseProducts(csv);
    expect(out.products[0].fragranticaUrl).toBe(
      'https://www.fragrantica.com/perfume/New-House/New-Scent-99999.html',
    );
    expect(out.products[0].imageUrl).toBe('https://fimgs.net/mdimg/perfume/375x500.99999.jpg');
  });

  it('respects Available? = No', () => {
    const soldOut = `── NICHE ──
Brand,Name,Gender,Available?,2ml,5ml,10ml,30ml,Fragrantica
Gone Brand,Gone Scent,Unisex,No,"$4,00",,,,🔗 Link`;
    const out = parseProducts(soldOut);
    expect(out.products[0].available).toBe(false);
  });

  it('skips a product row with no valid prices and records a warning', () => {
    const noPrice = `── NICHE ──
Brand,Name,Gender,Available?,2ml,5ml,10ml,30ml,Fragrantica
Empty Brand,Empty Scent,Unisex,Yes,,,,,🔗 Link`;
    const out = parseProducts(noPrice);
    expect(out.products.length).toBe(0);
    expect(out.errors.length).toBeGreaterThan(0);
  });
});
