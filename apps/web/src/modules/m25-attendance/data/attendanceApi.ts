"use client";
// Queries and changes for the Attendance screens (S25-01, S25-03, S25-04,
// S25-06, S25-11).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Scan } from "@/shared/ui/scan/scanOf";

/** One clock-in or clock-out. */
export interface ClockEvent {
  id: string;
  kind: "in" | "out";
  method: "nfc" | "qr" | "app" | "manual";
  at: string;
  station: string;
  late: boolean;
  note: string | null;
}

/** One person's day. */
export interface DaySummary {
  workDate: string;
  firstIn: string | null;
  lastOut: string | null;
  minutesOnSite: number;
  late: boolean;
  onSite: boolean;
}

/** A board row: a person and their day, or absent. */
export type BoardRow = Partial<DaySummary> & { staff: StaffRef; state: "present" | "absent" };

/** The super admin's rules. */
export interface AttendanceRules {
  dayStartsAt: string;
  graceMinutes: number;
  allowAppClock: boolean;
  doubleTapSeconds: number;
}

/** "08:05", in the browser's clock (the hotel's, on site). */
export const timeOf = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—");
/** "7 h 35 min". */
export const hoursOf = (minutes = 0) => `${Math.floor(minutes / 60)} h ${minutes % 60} min`;

export const useMyStatus = () => useQuery({ queryKey: ["attendance", "status"], queryFn: () => api<{ staff: StaffRef; clockedIn: boolean; last: ClockEvent | null; today: DaySummary | null; rules: AttendanceRules }>("/api/attendance/status") });

export const useBoard = (date: string) => useQuery({ queryKey: ["attendance", "board", date], queryFn: () => api<{ date: string; rows: BoardRow[] }>(`/api/attendance/board${date ? `?date=${date}` : ""}`) });

export const useOnSite = () => useQuery({ queryKey: ["attendance", "on-site"], queryFn: () => api<{ rows: BoardRow[] }>("/api/attendance/on-site"), refetchInterval: 30000 });

export const useMyDays = (from: string, to: string) => useQuery({ queryKey: ["attendance", "mine", from, to], queryFn: () => api<{ days: DaySummary[]; events: ClockEvent[] }>(`/api/attendance/mine?from=${from}&to=${to}`) });

export const useRules = () => useQuery({ queryKey: ["attendance", "rules"], queryFn: () => api<AttendanceRules>("/api/attendance/rules") });

export const useClockSelf = () => useApiMutation(() => api<{ event: ClockEvent }>("/api/attendance/clock", { method: "POST" }), { done: "Clock recorded", refresh: [["attendance"]] });

export const useStationClock = () =>
  useApiMutation((body: Scan & { station: string }) => api<{ event: ClockEvent; staff: StaffRef }>("/api/attendance/station-clock", { method: "POST", body }), { done: "Clock recorded", refresh: [["attendance"]] });

export const useSaveRules = () => useApiMutation((rules: AttendanceRules) => api<AttendanceRules>("/api/attendance/rules", { method: "PUT", body: rules }), { done: "Rules saved", refresh: [["attendance"]] });
