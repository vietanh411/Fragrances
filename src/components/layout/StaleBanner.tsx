/** Shown when products come from the committed fallback rather than the live sheet. */
export function StaleBanner() {
  return (
    <div className="border-b border-warn/20 bg-warn/10 px-4 py-2 text-center text-xs text-warn">
      Live inventory is temporarily unavailable — prices and availability shown may be out of date.
    </div>
  );
}
