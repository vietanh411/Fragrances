const ITEMS = [
  {
    title: 'Decanted from authentic bottles',
    body: 'Every vial is hand-poured from a genuine, full-size bottle — never reformulated or diluted.',
  },
  {
    title: 'Try before you commit',
    body: 'From 2ml samples to 30ml travel sizes — explore a fragrance properly before buying blind.',
  },
  {
    title: 'Hand-poured, shipped with care',
    body: 'Glass bottles for 5ml and up, packed to arrive safely, dispatched a few days after payment.',
  },
];

export function TrustBand() {
  return (
    <section className="container-luxe py-16">
      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.title} className="bg-ink-850 p-7">
            <div className="gilt-rule mb-5 w-8" />
            <h3 className="font-display text-xl text-champagne">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
