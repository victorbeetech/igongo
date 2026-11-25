// A labelled multi-line text box, for reports, posts and comments.

/** A text area with a visible label. */
export function TextArea({ label, value, onChange, rows = 4, required }: { label: string; value: string; onChange: (v: string) => void; rows?: number; required?: boolean }) {
  return (
    <label className="grid gap-1 text-label">
      {label}
      <textarea value={value} rows={rows} required={required} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-outline bg-surface-alt p-3 text-body" />
    </label>
  );
}
