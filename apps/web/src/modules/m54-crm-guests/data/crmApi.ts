"use client";
// Queries and changes for the CRM pages (S54-01, S54-05 to S54-07).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { GuestProfile } from "../domain/guestProfile";

export const useMyProfile = () => useQuery({ queryKey: ["crm", "me"], queryFn: () => api<GuestProfile>("/api/crm/me") });

export const useGuests = (q: string) => useQuery({ queryKey: ["crm", "guests", q], queryFn: () => api<{ items: GuestProfile[] }>(`/api/crm/guests${q ? `?q=${encodeURIComponent(q)}` : ""}`) });

export const useSaveMyDetails = () => useApiMutation((d: Partial<GuestProfile>) => api<GuestProfile>("/api/crm/me", { method: "PATCH", body: d }), { done: "Details saved", refresh: [["crm", "me"]] });

export const useSaveConsent = () => useApiMutation((c: { sms: boolean; whatsapp: boolean; email: boolean }) => api<GuestProfile>("/api/crm/me/consent", { method: "PUT", body: c }), { done: "Choices saved", refresh: [["crm", "me"]] });

export const useAddWalkIn = () => useApiMutation((g: { name: string; phone?: string }) => api<GuestProfile>("/api/crm/guests", { method: "POST", body: g }), { done: "Guest added", refresh: [["crm", "guests"]] });
