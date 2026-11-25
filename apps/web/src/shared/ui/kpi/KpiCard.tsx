// A dashboard number: a label and a big value in the brand display font.

/** One dashboard number. */
export function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <div className="line-clamp-2 text-caption text-muted">{label}</div>
      {/* Big numbers are a brand moment: Cinzel, with lining figures. */}
      <div className="truncate font-brand text-headline font-bold tabular-nums">{value}</div>
    </div>
  );
}
