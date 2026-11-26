"use client";
// A lifetime earnings statement: totals for the whole working life, then
// each year, bonuses and advances. Shared by S29-03 (mine) and S29-04.

import type { EarningsStatement, EarningsTotals } from "@/modules/m29-earnings-statements/data/earningsApi";
import { downloadFile } from "@/shared/api/downloadFile";
import { staffLine } from "@/shared/api/types/staffRef";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { Button } from "@/shared/ui/button/Button";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The headline numbers for [t]. */
function Totals({ t }: { t: EarningsTotals }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <KpiCard label="Gross pay" value={ugx(t.gross)} />
      <KpiCard label="Net pay" value={ugx(t.net)} />
      <KpiCard label="Cash bonuses" value={ugx(t.cashBonuses)} />
      <KpiCard label="Buffet passes (used)" value={`${t.buffetPasses} (${t.buffetPassesUsed})`} />
      <KpiCard label="Deductions" value={ugx(t.deductions)} />
      <KpiCard label="Advances taken" value={ugx(t.advancesTaken)} />
      <KpiCard label="Advances repaid" value={ugx(t.advancesRepaid)} />
      <KpiCard label="Payslips" value={String(t.payslips)} />
    </div>
  );
}

/** The statement, with a download of the same numbers from [csvPath]. */
export function StatementView({ statement: s, csvPath }: { statement: EarningsStatement; csvPath: string }) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-subtitle font-bold">{staffLine(s.staff)}</p>
        <Button variant="secondary" onClick={() => void downloadFile(csvPath, `earnings-${s.staff.staffNumber}.csv`)}>Download spreadsheet</Button>
      </div>
      <SectionHeader title="Lifetime" />
      <Totals t={s.lifetime} />
      <SectionHeader title="By year" />
      <DataTable
        rows={s.years}
        rowKey={(y) => y.year}
        empty="No pay yet."
        columns={[
          { label: "Year", cell: (y) => y.year },
          { label: "Gross", cell: (y) => ugx(y.totals.gross) },
          { label: "Net", cell: (y) => ugx(y.totals.net) },
          { label: "Bonuses", cell: (y) => ugx(y.totals.cashBonuses) },
          { label: "Buffet passes", cell: (y) => y.totals.buffetPasses },
          { label: "Advances", cell: (y) => ugx(y.totals.advancesTaken) },
        ]}
      />
      <SectionHeader title="Bonuses and rewards" />
      <DataTable
        rows={s.bonuses}
        rowKey={(b) => b.bonusId}
        empty="No bonuses yet."
        columns={[
          { label: "When", cell: (b) => dayTimeOf(b.createdAt) },
          { label: "Reward", cell: (b) => (b.kind === "cash" ? ugx(b.amount) : `${b.passes} buffet pass${b.passes === 1 ? "" : "es"}`) },
          { label: "Why", cell: (b) => b.reason },
          { label: "Status", cell: (b) => words(b.status) },
        ]}
      />
      <SectionHeader title="Advances and loans" />
      <DataTable
        rows={s.advances}
        rowKey={(a) => a.advanceId}
        empty="No advances or loans."
        columns={[
          { label: "Number", cell: (a) => a.number },
          { label: "Kind", cell: (a) => words(a.kind) },
          { label: "Amount", cell: (a) => ugx(a.amount) },
          { label: "Repaid", cell: (a) => ugx(a.repaid) },
          { label: "Status", cell: (a) => words(a.status) },
        ]}
      />
    </div>
  );
}
