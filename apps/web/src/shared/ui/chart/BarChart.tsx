// A small bar chart for dashboards in brand red. ECharts replaces it when
// real data arrives in Phase 7.

/** Bars for a week of sample values between 0 and 1. */
export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div role="img" aria-label="Bar chart for this week" className="flex h-32 items-end gap-2">
      {values.map((v, i) => (
        <div key={labels[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          {/* Today's bar is full red; earlier days are softer. */}
          <div className={`w-full rounded-t-sm ${i === values.length - 1 ? "bg-primary-text" : "bg-primary-text/35"}`} style={{ height: `${v * 100}%` }} />
          <span className="text-caption text-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
