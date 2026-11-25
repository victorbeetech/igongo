// The one table used by live list pages: labelled columns, one row per
// item, an "empty" line, and sideways scrolling on narrow screens.

import type { ReactNode } from "react";

/** One column: its heading and how to draw a cell. */
export interface Column<T> {
  label: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** A stable key for each row. */
  rowKey: (row: T) => string;
  /** What to say when there are no rows. */
  empty?: string;
}

/** A bordered, scrollable table of [rows]. */
export function DataTable<T>({ columns, rows, rowKey, empty = "Nothing here yet." }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full text-caption">
        <thead className="bg-surface-alt">
          <tr>{columns.map((c) => <th key={c.label} className="p-2 text-left">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-line">
              {columns.map((c) => <td key={c.label} className="p-2 align-top">{c.cell(row)}</td>)}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={columns.length} className="p-3 text-muted">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
