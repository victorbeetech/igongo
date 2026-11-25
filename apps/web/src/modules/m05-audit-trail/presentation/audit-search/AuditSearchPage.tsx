"use client";
// S05-01 Audit search: "who did X, and when", years back. Search words,
// filter by module, page back in time, and check the hash chain for
// tampering. Live from the append-only Audit Trail.

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { api } from "@/shared/api/apiClient";
import { ErrorState } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SearchField } from "@/shared/ui/search/SearchField";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";

/** One entry, as the API returns it. */
interface Entry {
  seq: number;
  occurredAt: string;
  actorName?: string;
  actorId: string | null;
  action: string;
  module: string;
  summary: string;
}

/** The audit search page. */
export function AuditSearchPage({ screen }: { screen: ScreenContext }) {
  const [q, setQ] = useState("");
  const [module, setModule] = useState("");
  const entries = useInfiniteQuery({
    queryKey: ["audit", q, module],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      api<{ items: Entry[]; nextBeforeSeq: number | null }>(`/api/audit/entries?limit=50${q ? `&q=${encodeURIComponent(q)}` : ""}${module ? `&module=${module}` : ""}${pageParam ? `&beforeSeq=${pageParam}` : ""}`),
    getNextPageParam: (last) => last.nextBeforeSeq ?? undefined,
  });
  const chain = useQuery({ queryKey: ["audit-verify"], queryFn: () => api<{ intact: boolean; checked: number; brokenAtSeq: number | null }>("/api/audit/verify"), enabled: false });
  const rows = entries.data?.pages.flatMap((p) => p.items) ?? [];
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-56 flex-1"><SearchField hint="Search what happened or who did it" value={q} onChange={setQ} /></div>
          <input aria-label="Module key" placeholder="Module, such as roles-permissions" value={module} onChange={(e) => setModule(e.target.value.trim())} className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body" />
          <Button variant="secondary" icon={<ShieldCheck size={16} aria-hidden />} onClick={() => void chain.refetch()}>Check for tampering</Button>
        </div>
        {chain.data && (
          <p role="status" className={`text-label font-bold ${chain.data.intact ? "text-success" : "text-error"}`}>
            {chain.data.intact ? `Intact: ${chain.data.checked} entries checked, none changed.` : `Tampering found at entry ${chain.data.brokenAtSeq}.`}
          </p>
        )}
        {entries.isPending ? <SkeletonList /> : entries.isError ? <ErrorState error={entries.error} name={screen.spec.name} /> : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-caption">
              <thead className="bg-surface-alt"><tr><th className="p-2 text-left">When</th><th className="p-2 text-left">Who</th><th className="p-2 text-left">What</th><th className="p-2 text-left">Module</th></tr></thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.seq} className="border-t border-line">
                    <td className="p-2 whitespace-nowrap">{new Date(e.occurredAt).toLocaleString()}</td>
                    <td className="p-2">{e.actorName ?? e.actorId ?? "System"}</td>
                    <td className="p-2">{e.summary}</td>
                    <td className="p-2">{e.module}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={4} className="p-3 text-muted">Nothing matches.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        {entries.hasNextPage && <Button variant="secondary" onClick={() => void entries.fetchNextPage()} disabled={entries.isFetchingNextPage}>Older entries</Button>}
      </div>
    </>
  );
}
