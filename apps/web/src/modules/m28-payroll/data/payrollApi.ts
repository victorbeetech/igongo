"use client";
// Queries and changes for the Payroll screens (S28-01 to S28-07). Every
// call is a staff tool: the API checks the payroll permissions.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { PayLine } from "../domain/payLines";

export const PAY_METHODS = ["bank", "mobile_money", "cash"] as const;

/** What one person is paid each month. */
export interface PayProfile {
  basic: number;
  allowances: PayLine[];
  payMethod: (typeof PAY_METHODS)[number];
  account: string | null;
  active: boolean;
}

/** A month's pay run. */
export interface PayRun {
  id: string;
  period: string;
  status: "draft" | "approved" | "paid" | "cancelled";
  staffCount: number;
  gross: number;
  deductions: number;
  net: number;
  employerCost: number;
  createdByName: string;
  approvedByName: string | null;
  paidByName: string | null;
}

/** One person's payslip in a run. */
export interface Payslip {
  id: string;
  staffName: string;
  staffNumber: string;
  department: string | null;
  basic: number;
  earnings: PayLine[];
  gross: number;
  deductions: PayLine[];
  totalDeductions: number;
  net: number;
  adjustments: PayLine[];
}

/** A deduction rule (PAYE, NSSF and the like), entered by the super admin. */
export interface DeductionRule {
  key: string;
  name: string;
  kind: "percent" | "fixed" | "bands";
  rate: number;
  amount: number;
  bands: { upTo: number | null; rate: number }[];
  base: "gross" | "basic";
  employerRate: number;
}
export interface PayrollSettings {
  deductions: DeductionRule[];
  approverMustDiffer: boolean;
}

export const useProfiles = () => useQuery({ queryKey: ["payroll", "profiles"], queryFn: () => api<{ items: { staff: StaffRef; profile: PayProfile | null }[] }>("/api/payroll/profiles") });

export const useSaveProfile = () =>
  useApiMutation(({ staffId, profile }: { staffId: string; profile: PayProfile }) => api(`/api/payroll/profiles/${staffId}`, { method: "PUT", body: profile }), { done: "Pay profile saved", refresh: [["payroll", "profiles"]] });

export const useRuns = () => useQuery({ queryKey: ["payroll", "runs"], queryFn: () => api<{ items: PayRun[] }>("/api/payroll/runs") });

export const useRun = (id: string) => useQuery({ queryKey: ["payroll", "runs", id], queryFn: () => api<{ run: PayRun; payslips: Payslip[] }>(`/api/payroll/runs/${id}`), enabled: !!id });

export const useStartRun = () => useApiMutation((period: string) => api<PayRun>("/api/payroll/runs", { method: "POST", body: { period } }), { done: "Pay run started", refresh: [["payroll", "runs"]] });

/** A step on a run: recalculate, approve, paid or cancel. */
export const useRunStep = (id: string) =>
  useApiMutation((step: "recalculate" | "approve" | "paid" | "cancel") => api<PayRun>(`/api/payroll/runs/${id}/${step}`, { method: "POST" }), { done: "Pay run updated", refresh: [["payroll"]] });

export const useAdjust = () =>
  useApiMutation(({ payslipId, adjustments }: { payslipId: string; adjustments: PayLine[] }) => api(`/api/payroll/payslips/${payslipId}/adjustments`, { method: "PUT", body: { adjustments } }), { done: "Payslip changed", refresh: [["payroll"]] });

export const usePayrollSettings = () => useQuery({ queryKey: ["payroll", "settings"], queryFn: () => api<PayrollSettings>("/api/payroll/settings") });

export const useSavePayrollSettings = () => useApiMutation((s: PayrollSettings) => api<PayrollSettings>("/api/payroll/settings", { method: "PUT", body: s }), { done: "Deductions saved", refresh: [["payroll"]] });
