// Grey placeholder rows shown while a page loads, under the brand spiral.

import { SpiralLoader } from "../loader/SpiralLoader";

/** Placeholder rows that stand where content will appear. */
export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-busy className="py-4">
      <div className="flex justify-center pb-4">
        <SpiralLoader />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2">
          <span className="size-9 rounded-full bg-surface-alt" />
          <span className="grid flex-1 gap-2">
            <span className="h-2.5 w-2/3 rounded bg-surface-alt" />
            <span className="h-2.5 w-1/3 rounded bg-surface-alt" />
          </span>
        </div>
      ))}
    </div>
  );
}
