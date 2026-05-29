// Regenerate src/lib/fallback-csv.ts from the captured Sheet fixture.
// Run with: node scripts/gen-fallback.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const csv = readFileSync('tests/fixtures/sample-sheet.csv', 'utf8');

// Escape for a JS template literal: backslash, backtick, and `${`.
const esc = csv
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const out = `// AUTO-GENERATED fallback snapshot of the Google Sheet (a recent successful capture).
// Used ONLY when the live fetch fails, so the storefront is never blank.
// To refresh: re-download the CSV to tests/fixtures/sample-sheet.csv, then run
//   node scripts/gen-fallback.mjs
export const FALLBACK_CSV = \`${esc}\`;
`;

writeFileSync('src/lib/fallback-csv.ts', out, 'utf8');
console.log(`Wrote src/lib/fallback-csv.ts (${out.length} chars)`);
