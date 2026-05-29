// Typed access to environment variables. Server-only values are read from
// process.env; the Web3Forms key is public (NEXT_PUBLIC_) so it can be used in
// the browser at checkout.

const DEFAULT_SHEET_ID = '1vrymjukHfJ6V2czy5FVGAM5-edoC7n_DP2LpWwudfDE';
const DEFAULT_SHEET_GID = '557117222';

/** The Google Sheet CSV export URL (server fetch follows the redirect). */
export function sheetCsvUrl(): string {
  const id = process.env.SHEET_ID || DEFAULT_SHEET_ID;
  const gid = process.env.SHEET_GID || DEFAULT_SHEET_GID;
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

/** Public Web3Forms access key (may be a placeholder until the owner sets it). */
export function web3formsKey(): string {
  return process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';
}

/** True when a real (non-placeholder) Web3Forms key is configured. */
export function hasWeb3formsKey(): boolean {
  const key = web3formsKey().trim();
  return key !== '' && key !== 'your-web3forms-access-key';
}
