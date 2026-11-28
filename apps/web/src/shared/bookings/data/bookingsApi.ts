"use client";
// Queries and changes for every booking module's pages. Each hook takes the
// module's place (API path), so rooms, museum, events, pool and shop share them.

import { useQuery } from "@tanstack/react-query";
import { allHistoryPages } from "@/shared/api/allHistoryPages";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Booking } from "../types/booking";
import type { BookingPlace } from "../types/bookingPlace";
import type { BookingRules } from "../types/bookingRules";
import type { Offering } from "../types/offering";

/** What is on sale; [all] for staff (hidden and switched-off ones too). */
export const useOfferings = (p: BookingPlace, all = false) =>
  useQuery({ queryKey: [p.path, "offerings", all], queryFn: () => api<{ items: Offering[] }>(`${p.path}/offerings${all ? "?all=1" : ""}`) });

export const useMyBookings = (p: BookingPlace) => useQuery({ queryKey: [p.path, "mine"], queryFn: () => allHistoryPages<Booking>(`${p.path}/bookings/mine`) });

export const useDayBookings = (p: BookingPlace, date: string) =>
  useQuery({ queryKey: [p.path, "day", date], queryFn: () => api<{ items: Booking[] }>(`${p.path}/bookings${date ? `?date=${date}` : ""}`), refetchInterval: 30000 });

export const useRules = (p: BookingPlace) => useQuery({ queryKey: [p.path, "rules"], queryFn: () => api<BookingRules>(`${p.path}/rules`) });

/** The body of a new booking. */
export interface BookInput {
  offeringId: string;
  units: number;
  date?: string;
  endDate?: string;
  slot?: string;
  notes?: string;
  guest?: { name: string; phone?: string };
}

export const useBook = (p: BookingPlace) => useApiMutation((b: BookInput) => api<Booking>(`${p.path}/bookings`, { method: "POST", body: b }), { done: "Booked", refresh: [[p.path]] });

export const useCancelBooking = (p: BookingPlace) =>
  useApiMutation((v: { id: string; reason: string }) => api<Booking>(`${p.path}/bookings/${v.id}/cancel`, { method: "POST", body: { reason: v.reason } }), { done: "Cancelled", refresh: [[p.path]] });

/** Staff assign (or clear, with an empty value) the room or cottage number of a booking. */
export const useAssignUnit = (p: BookingPlace) =>
  useApiMutation((v: { id: string; unit: string }) => api<Booking>(`${p.path}/bookings/${v.id}/unit`, { method: "PATCH", body: { unit: v.unit.trim() || null } }), { done: "Room saved", refresh: [[p.path]] });

export const useApprove = (p: BookingPlace) =>
  useApiMutation((v: { id: string; total?: number }) => api<Booking>(`${p.path}/bookings/${v.id}/approve`, { method: "POST", body: v.total === undefined ? {} : { total: v.total } }), { done: "Approved", refresh: [[p.path]] });

export const useCheckIn = (p: BookingPlace) => useApiMutation((code: string) => api<Booking>(`${p.path}/check-in`, { method: "POST", body: { code } }), { done: "Checked in", refresh: [[p.path]] });

export const useSaveRules = (p: BookingPlace) => useApiMutation((r: BookingRules) => api<BookingRules>(`${p.path}/rules`, { method: "PUT", body: r }), { done: "Rules saved", refresh: [[p.path, "rules"]] });

export const useAddOffering = (p: BookingPlace) =>
  useApiMutation((o: Partial<Offering>) => api<Offering>(`${p.path}/offerings`, { method: "POST", body: o }), { done: "Added", refresh: [[p.path, "offerings"]] });

export const useEditOffering = (p: BookingPlace) =>
  useApiMutation((v: { id: string; patch: Partial<Offering> }) => api<Offering>(`${p.path}/offerings/${v.id}`, { method: "PATCH", body: v.patch }), { done: "Saved", refresh: [[p.path, "offerings"]] });
