"use client";
// Queries for Records Archive & Search: the permanent record of everything
// done in the system, searchable years back ("who did X two years ago").

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";

/** One entry in the permanent record. */
export interface RecordEntry {
  seq: number;
  id: string;
  occurredAt: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  module: string;
  recordType?: string;
  recordId?: string;
  summary: string;
}

/** The search filters; empty strings are left out. */
export interface RecordFilter {
  q: string;
  module: string;
  from: string;
  to: string;
}

/** The query part for [f], without paging. */
export function filterQuery(f: RecordFilter): string {
  const parts = Object.entries(f).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(k === "to" ? `${v}T23:59:59+03:00` : k === "from" ? `${v}T00:00:00+03:00` : v)}`);
  return parts.join("&");
}

/** Pages of results, newest first; "More" asks for the page before the last one. */
export const useRecordSearch = (f: RecordFilter) =>
  useInfiniteQuery({
    queryKey: ["records", f],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => api<{ items: RecordEntry[]; nextBeforeSeq: number | null }>(`/api/records/search?limit=50&${filterQuery(f)}${pageParam ? `&beforeSeq=${pageParam}` : ""}`),
    getNextPageParam: (last) => last.nextBeforeSeq ?? undefined,
  });
