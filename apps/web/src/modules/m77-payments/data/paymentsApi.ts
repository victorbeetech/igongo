"use client";
// Queries and changes for the Payments pages (S77-01 to S77-10).

import { useQuery } from "@tanstack/react-query";
import { allHistoryPages } from "@/shared/api/allHistoryPages";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { MethodInfo, MethodSettings } from "../domain/methodInfo";
import type { Payment } from "../domain/payment";

/** Methods switched on for [module] (and [outlet]). */
export const useMethods = (module: string, outlet?: string) =>
  useQuery({ queryKey: ["payments", "methods", module, outlet], queryFn: () => api<{ items: MethodInfo[]; preview: MethodInfo[] }>(`/api/payments/methods?module=${module}${outlet ? `&outlet=${outlet}` : ""}`), enabled: !!module });

/** One payment; while pending, asks every 4 s (the API re-checks with the provider). */
export const usePayment = (id: string) =>
  useQuery({ queryKey: ["payments", id], queryFn: () => api<Payment>(`/api/payments/${id}`), enabled: !!id, refetchInterval: (q) => (q.state.data?.status === "pending" ? 4000 : false) });

export const usePayments = (mine: boolean) => useQuery({ queryKey: ["payments", "list", mine], queryFn: () => allHistoryPages<Payment>(`/api/payments${mine ? "?mine=1" : ""}`) });

export const useMethodSettings = () => useQuery({ queryKey: ["payments", "settings"], queryFn: () => api<MethodSettings>("/api/payments/settings") });

export const useSaveMethodSettings = () => useApiMutation((s: MethodSettings) => api<MethodSettings>("/api/payments/settings", { method: "PUT", body: s }), { done: "Payment methods saved", refresh: [["payments"]] });

/** Pays in the app. */
export const usePay = () =>
  useApiMutation((b: { module: string; recordId: string; method: string; phone?: string; amount?: number }) => api<Payment>("/api/payments/pay", { method: "POST", body: b }), { done: "Payment started", refresh: [["payments"]] });

/** Staff record a till payment. */
export const useRecordPayment = () =>
  useApiMutation((b: { module: string; recordId: string; method: string; amount?: number; reference?: string }) => api<Payment>("/api/payments/record", { method: "POST", body: b }), { done: "Payment recorded", refresh: [["payments"]] });

/** One settlement line: money in for a day, method, module and outlet. */
export interface SettlementRow {
  day: string;
  method: string;
  module: string;
  outlet: string | null;
  count: number;
  amount: number;
  refunded: number;
  net: number;
}

export const useSettlement = (from: string, to: string) =>
  useQuery({ queryKey: ["payments", "settlement", from, to], queryFn: () => api<{ from: string; to: string; items: SettlementRow[]; total: number }>(`/api/payments/settlement?from=${from}&to=${to}`), enabled: !!from && !!to && from <= to });

/** Which gateways have their keys saved (super admin). */
export const useConnections = () => useQuery({ queryKey: ["payments", "connections"], queryFn: () => api<Record<string, boolean>>("/api/payments/connections") });
