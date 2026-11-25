// A small upper-case header above a group of rows.

/** A section title such as "Details" or "History". */
export function SectionHeader({ title }: { title: string }) {
  return <h2 className="px-4 pt-4 pb-1 text-caption font-bold tracking-widest text-muted uppercase">{title}</h2>;
}
