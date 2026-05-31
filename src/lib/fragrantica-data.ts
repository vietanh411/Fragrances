// Canonical Fragrantica page URLs per product slug (slug = toSlug(brand, name)).
//
// Used to (a) link "View on Fragrantica" to the real page and (b) derive the
// product photo from Fragrantica's image CDN (fimgs.net) — the image id is the
// trailing number in the URL.
//
// Sourced via web search of fragrantica.com. Two dupe fragrances have no
// dedicated Fragrantica page and are intentionally absent (they fall back to a
// search link + the generated motif): Julianna's Perfumes "Bad Bitch" and
// Soi Parfums "Creamy Dream".
//
// To add/fix one: find the fragrance's fragrantica.com/perfume/... URL and add
// an entry keyed by its slug.

export const FRAGRANTICA_URLS: Record<string, string> = {
  // ── Niche ──
  '27-87-per-se': 'https://www.fragrantica.com/perfume/27-87/Per-Se-87557.html',
  'alfred-ritchy-nassau': 'https://www.fragrantica.com/perfume/Alfred-Ritchy/Nassau-94294.html',
  'arabian-oud-mukhallat-dewan-al-sharq':
    'https://www.fragrantica.com/perfume/Arabian-Oud/Mukhallat-Dewan-Al-Sharq-21641.html',
  'arabian-oud-royal-oud': 'https://www.fragrantica.com/perfume/Arabian-Oud/Royal-Oud-68298.html',
  'bdk-parfums-gris-charnel-extrait':
    'https://www.fragrantica.com/perfume/BDK-Parfums/Gris-Charnel-Extrait-73645.html',
  'dedcool-mochi-milk': 'https://www.fragrantica.com/perfume/DedCool/Mochi-Milk-104275.html',
  'etat-libre-dorange-above-the-waves':
    'https://www.fragrantica.com/perfume/Etat-Libre-d-Orange/Above-the-Waves-105774.html',
  'etat-libre-dorange-you-or-someone-like-you':
    'https://www.fragrantica.com/perfume/Etat-Libre-d-Orange/You-Or-Someone-Like-You-43531.html',
  'fugazzi-passionfroudh': 'https://www.fragrantica.com/perfume/Fugazzi/Passionfroudh-102896.html',
  'goldfield-banks-australia-pacific-rock-moss':
    'https://www.fragrantica.com/perfume/Goldfield-Banks-Australia/Pacific-Rock-Moss-44120.html',
  'goldfield-banks-australia-ingenious-ginger':
    'https://www.fragrantica.com/perfume/Goldfield-Banks-Australia/Ingenious-Ginger-81895.html',
  'heretic-parfum-dirty-hinoki':
    'https://www.fragrantica.com/perfume/Heretic-Parfum/Dirty-Hinoki-69481.html',
  'juliette-has-a-gun-juliette':
    'https://www.fragrantica.com/perfume/Juliette-Has-A-Gun/Juliette-90396.html',
  'juliette-has-a-gun-not-a-perfume':
    'https://www.fragrantica.com/perfume/Juliette-Has-A-Gun/Not-A-Perfume-10296.html',
  'librery-parfum-hot-sand':
    'https://www.fragrantica.com/perfume/Librery-Parfum/Hot-Sand-101105.html',
  'liis-floating': 'https://www.fragrantica.com/perfume/Liis/Floating-74127.html',
  'maison-de-lasie-nanyang':
    'https://www.fragrantica.com/perfume/Maison-de-L-Asie/Nanyang-68343.html',
  'mancera-amore-caffe': 'https://www.fragrantica.com/perfume/Mancera/Amore-Caffe-87409.html',
  'memo-paris-madurai': 'https://www.fragrantica.com/perfume/Memo-Paris/Madurai-75181.html',
  'montale-intense-cafe': 'https://www.fragrantica.com/perfume/Montale/Intense-Cafe-18021.html',
  'nishane-wulong-cha-x': 'https://www.fragrantica.com/perfume/Nishane/Wulong-Cha-X-80465.html',
  'obvious-scoville': 'https://www.fragrantica.com/perfume/Obvious/Scoville-90577.html',
  'roan-current-culture': 'https://www.fragrantica.com/perfume/ROAN/Current-Culture-94885.html',
  'roja-dove-elysium-pour-femme':
    'https://www.fragrantica.com/perfume/Roja-Dove/Elysium-Pour-Femme-90214.html',
  'room-1015-wavechild': 'https://www.fragrantica.com/perfume/Room-1015/Wavechild-91364.html',
  'scents-of-wood-vanilla-in-bourbon':
    'https://www.fragrantica.com/perfume/Scents-of-Wood/Vanilla-in-Bourbon-81909.html',
  'veronique-gabai-vert-desir':
    'https://www.fragrantica.com/perfume/Veronique-Gabai/Vert-Desir-60670.html',
  'wait-haru': 'https://www.fragrantica.com/perfume/WA-IT/Haru-103459.html',

  // ── Designer ──
  'acqua-di-parma-buongiorno':
    'https://www.fragrantica.com/perfume/Acqua-di-Parma/Buongiorno-103426.html',
  'acqua-di-parma-fico-di-amalfi-la-riserva':
    'https://www.fragrantica.com/perfume/Acqua-di-Parma/Fico-di-Amalfi-La-Riserva-107110.html',
  'estee-lauder-infinite-sky':
    'https://www.fragrantica.com/perfume/Estee-Lauder/Infinite-Sky-69702.html',
  'guerlain-herbes-troublantes':
    'https://www.fragrantica.com/perfume/Guerlain/Herbes-Troublantes-69275.html',
  'jean-paul-gaultier-le-male-le-parfum':
    'https://www.fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Le-Parfum-61856.html',
  'louis-vuitton-afternoon-swim':
    'https://www.fragrantica.com/perfume/Louis-Vuitton/Afternoon-Swim-53947.html',
  'louis-vuitton-imagination':
    'https://www.fragrantica.com/perfume/Louis-Vuitton/Imagination-67370.html',
  'louis-vuitton-le-jour-se-leve':
    'https://www.fragrantica.com/perfume/Louis-Vuitton/Le-Jour-se-Leve-48305.html',
  'miu-miu-fleur-de-lait':
    'https://www.fragrantica.com/perfume/Miu-Miu/Miu-Miu-Fleur-de-Lait-78755.html',

  // ── Dupe ──
  'afnan-turathi-blue-vibrato':
    'https://www.fragrantica.com/perfume/Afnan/Turathi-Blue-70839.html',
  'arabiyat-prestige-marwa-imagination':
    'https://www.fragrantica.com/perfume/Arabiyat-Prestige/Marwa-107084.html',
  'lattafa-perfumes-khamrah':
    'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-75805.html',
  'lattafa-perfumes-opulent-dubai-god-of-fire':
    'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Opulent-Dubai-105609.html',
  'maison-alhambra-jean-lowe-azure-afternoon-swim':
    'https://www.fragrantica.com/perfume/Maison-Alhambra/Jean-Lowe-Azure-100480.html',
  'paris-corner-coconut-lagoon-virgin-island-water':
    'https://www.fragrantica.com/perfume/PARIS-CORNER/Coconut-Lagoon-101955.html',
  'rayhaan-aquatica-virgin-island-water':
    'https://www.fragrantica.com/perfume/Rayhaan/Aquatica-120605.html',
};
