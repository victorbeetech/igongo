// A labelled drop-down list.

/** A select with a visible label; [options] are [value, words] pairs. */
export function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="grid gap-1 text-label">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body">
        {options.map(([v, words]) => <option key={v} value={v}>{words}</option>)}
      </select>
    </label>
  );
}
