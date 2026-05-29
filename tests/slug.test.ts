import { describe, it, expect } from 'vitest';
import { toSlug } from '@/lib/slug';

describe('toSlug', () => {
  it('combines brand and name into a url-safe slug', () => {
    expect(toSlug('Louis Vuitton', 'Afternoon Swim')).toBe('louis-vuitton-afternoon-swim');
  });

  it('strips apostrophes and ampersands', () => {
    expect(toSlug("Etat Libre d'Orange", 'Above the Waves')).toBe(
      'etat-libre-dorange-above-the-waves',
    );
    expect(toSlug('Goldfield & Banks Australia', 'Pacific Rock Moss')).toBe(
      'goldfield-banks-australia-pacific-rock-moss',
    );
  });

  it('folds accented characters to ascii', () => {
    expect(toSlug('Veronique Gabai', 'Vert Désir')).toBe('veronique-gabai-vert-desir');
    expect(toSlug('Mancera', 'Amore Caffè')).toBe('mancera-amore-caffe');
  });

  it('keeps parenthetical dupe notes distinct', () => {
    expect(toSlug('Maison Alhambra', 'Jean Lowe Azure (Afternoon Swim)')).toBe(
      'maison-alhambra-jean-lowe-azure-afternoon-swim',
    );
  });

  it('collapses repeated separators and trims edges', () => {
    expect(toSlug('WA:IT', 'Haru')).toBe('wait-haru');
    expect(toSlug('27 87', 'Per Se')).toBe('27-87-per-se');
  });
});
