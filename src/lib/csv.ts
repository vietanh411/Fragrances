// Robust CSV → string[][] using PapaParse.
//
// The sheet has quoted fields containing commas ("$4,00") and quoted cells with
// embedded newlines (the multi-line NOTES/CONTACT banner). A naive line split
// breaks on both, so we delegate to PapaParse which handles them correctly.

import Papa from 'papaparse';

export function parseCsv(text: string): string[][] {
  const result = Papa.parse<string[]>(text, {
    skipEmptyLines: false, // we want to see blank rows so we can treat them as separators
  });
  // PapaParse rows are string[]; coerce defensively.
  return (result.data as unknown[][]).map((row) =>
    Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : [],
  );
}
