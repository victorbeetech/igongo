"use client";
// Queries and changes for the Delivery & Riders pages (S66-01 to S66-11).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { DeliveryJob } from "../domain/deliveryJob";
import type { DeliveryRules } from "../domain/deliveryRules";
import type { RiderStatus } from "../domain/riderStatus";

export const useDispatchBoard = () =>
  useQuery({ queryKey: ["delivery", "board"], queryFn: () => api<{ waiting: DeliveryJob[]; active: DeliveryJob[]; done: DeliveryJob[]; riders: RiderStatus[] }>("/api/delivery/board"), refetchInterval: 15000 });

export const useRiders = () => useQuery({ queryKey: ["delivery", "riders"], queryFn: () => api<{ items: RiderStatus[] }>("/api/delivery/riders") });

export const useDeliveryRules = () => useQuery({ queryKey: ["delivery", "rules"], queryFn: () => api<DeliveryRules>("/api/delivery/rules") });

/** My shift as a rider. */
export const useMyShift = () =>
  useQuery({
    queryKey: ["delivery", "me"],
    queryFn: () => api<{ status: RiderStatus | null; current: DeliveryJob[]; tripsToday: number; earningsToday: number; cashInHand: number; cashLimit: number; history: DeliveryJob[] }>("/api/delivery/rider/me"),
    refetchInterval: 15000,
  });

const refresh = { refresh: [["delivery"]] };

export const useSaveDeliveryRules = () => useApiMutation((r: DeliveryRules) => api<DeliveryRules>("/api/delivery/rules", { method: "PUT", body: r }), { done: "Delivery rules saved", ...refresh });

export const useAssign = () => useApiMutation((v: { jobId: string; riderUserId: string }) => api<DeliveryJob>(`/api/delivery/jobs/${v.jobId}/assign`, { method: "POST", body: { riderUserId: v.riderUserId } }), { done: "Assigned", ...refresh });

export const useReceiveCash = () => useApiMutation((riderUserId: string) => api<{ amount: number }>(`/api/delivery/riders/${riderUserId}/cash`, { method: "POST" }), { done: "Cash received", ...refresh });

export const useGoOnline = () => useApiMutation((online: boolean) => api<RiderStatus>("/api/delivery/rider/online", { method: "POST", body: { online } }), { done: "Status changed", ...refresh });

export const usePing = () => useApiMutation((p: { lat: number; lng: number }) => api<null>("/api/delivery/rider/location", { method: "POST", body: p }), { done: "Location shared", refresh: [] });

/** The rider's step on a job. */
export const useJobStep = () =>
  useApiMutation((v: { jobId: string; step: "accept" | "decline" | "pickup" | "deliver" | "fail"; body?: unknown }) => api<DeliveryJob>(`/api/delivery/jobs/${v.jobId}/${v.step}`, { method: "POST", body: v.body ?? {} }), { done: "Done", ...refresh });
