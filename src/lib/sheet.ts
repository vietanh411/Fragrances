// Server-side fetch of the published Google Sheet CSV.
//
// Server fetch (not browser) avoids CORS, follows Google's 307 redirect, and
// `next: { revalidate }` gives ISR-style live sync: the sheet is hit at most once
// per minute and edits appear on the site within ~60s without a redeploy.

import { sheetCsvUrl } from '@/lib/env';

export const SHEET_REVALIDATE_SECONDS = 60;

export interface SheetFetchResult {
  ok: boolean;
  csv: string | null;
  error: string | null;
}

export async function fetchSheetCsv(): Promise<SheetFetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(sheetCsvUrl(), {
      signal: controller.signal,
      next: { revalidate: SHEET_REVALIDATE_SECONDS },
      headers: { Accept: 'text/csv' },
    });
    if (!res.ok) {
      return { ok: false, csv: null, error: `Sheet responded ${res.status}` };
    }
    const csv = await res.text();
    // A private/unshared sheet returns an HTML sign-in page, not CSV.
    if (csv.trimStart().toLowerCase().startsWith('<!doctype html')) {
      return { ok: false, csv: null, error: 'Sheet is not publicly viewable' };
    }
    return { ok: true, csv, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown fetch error';
    return { ok: false, csv: null, error };
  } finally {
    clearTimeout(timeout);
  }
}
