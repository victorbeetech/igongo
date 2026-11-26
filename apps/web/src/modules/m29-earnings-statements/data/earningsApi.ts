"use client";
// Queries for the Earnings Statements screens (S29-01 to S29-04): payslips
// and the lifetime statement, for me or (as a staff tool) for anyone.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";

/** A named amount. */
interface PayLine {
  name: string;
  amount: number;
}

/** A payslip as a staff member sees it. */
export interface PayslipView {
  payslipId: string;
  period: string;
  staffName: string;
  staffNumber: string;
  department: string | null;
  basic: number;
  earnings: PayLine[];
  gross: number;
  deductions: PayLine[];
  totalDeductions: number;
  net: number;
  status: string;
  paidAt: string | null;
}

/** Totals for a year or a whole working life. */
export interface EarningsTotals {
  gross: number;
  deductions: number;
  net: number;
  cashBonuses: number;
  buffetPasses: number;
  buffetPassesUsed: number;
  advancesTaken: number;
  advancesRepaid: number;
  payslips: number;
}

/** The whole statement. */
export interface EarningsStatement {
  staff: StaffRef;
  lifetime: EarningsTotals;
  years: { year: string; totals: EarningsTotals }[];
  payslips: PayslipView[];
  bonuses: { bonusId: string; kind: string; amount: number; passes: number; passesUsed: number; reason: string; status: string; createdAt: string }[];
  advances: { advanceId: string; number: string; kind: string; amount: number; repaid: number; status: string; requestedAt: string }[];
}

export const useMyStatement = () => useQuery({ queryKey: ["earnings", "mine"], queryFn: () => api<EarningsStatement>("/api/earnings/mine") });

export const useMyPayslip = (id: string) => useQuery({ queryKey: ["earnings", "payslip", id], queryFn: () => api<PayslipView>(`/api/earnings/mine/payslips/${id}`), enabled: !!id });

export const useStaffStatement = (staffId: string) => useQuery({ queryKey: ["earnings", "staff", staffId], queryFn: () => api<EarningsStatement>(`/api/earnings/staff/${staffId}`), enabled: !!staffId });
