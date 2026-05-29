import { describe, it, expect } from 'vitest';
import { buildFragranticaUrl } from '@/lib/fragrantica';

describe('buildFragranticaUrl', () => {
  it('builds a google site-search url scoped to fragrantica', () => {
    const url = buildFragranticaUrl('Roja Dove', 'Elysium Pour Femme');
    expect(url).toContain('https://www.google.com/search?q=');
    expect(url).toContain(encodeURIComponent('site:fragrantica.com'));
    expect(url).toContain(encodeURIComponent('Roja Dove'));
    expect(url).toContain(encodeURIComponent('Elysium Pour Femme'));
  });

  it('strips trailing parenthetical dupe notes from the query', () => {
    const url = buildFragranticaUrl('Maison Alhambra', 'Jean Lowe Azure (Afternoon Swim)');
    expect(url).toContain(encodeURIComponent('Jean Lowe Azure'));
    expect(url).not.toContain(encodeURIComponent('Afternoon Swim'));
  });

  it('is deterministic for the same input', () => {
    const a = buildFragranticaUrl('Lattafa Perfumes', 'Khamrah');
    const b = buildFragranticaUrl('Lattafa Perfumes', 'Khamrah');
    expect(a).toBe(b);
  });
});
