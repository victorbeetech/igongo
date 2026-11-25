"use client";
// Queries and changes for the Staff Cards screens (S16-08, S16-09, S16-15, S16-19).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Scan } from "@/shared/ui/scan/scanOf";

/** A card, as the API returns it (the QR text is ready to print). */
export interface StaffCardRecord {
  cardId: string;
  cardNumber: string;
  uid: string | null;
  qr: string;
  cardType: string;
  templateKey: string;
  staffId: string | null;
  status: "unassigned" | "active" | "lost" | "revoked";
  issuedAt: string | null;
}

/** One line of a card's history. */
export interface CardHistoryEntry {
  id: string;
  action: string;
  staffId: string | null;
  at: string;
}

/** Status words for people. */
export const CARD_STATUS_WORDS: Record<StaffCardRecord["status"], string> = { unassigned: "In stock", active: "Active", lost: "Lost", revoked: "Revoked" };

export const useCards = (status: string) =>
  useQuery({ queryKey: ["cards", status], queryFn: () => api<{ items: (StaffCardRecord & { holder: StaffRef | null })[] }>(`/api/cards?limit=200${status ? `&status=${status}` : ""}`) });

export const useCardSummary = () => useQuery({ queryKey: ["cards", "summary"], queryFn: () => api<Record<StaffCardRecord["status"], number>>("/api/cards/summary") });

export const useCard = (id: string) =>
  useQuery({ queryKey: ["cards", id], queryFn: () => api<{ card: StaffCardRecord; holder: StaffRef | null; history: CardHistoryEntry[] }>(`/api/cards/${id}`), enabled: !!id });

export const useMyCard = () => useQuery({ queryKey: ["cards", "mine"], queryFn: () => api<{ card: StaffCardRecord | null; holder: StaffRef }>("/api/cards/mine") });

export const useRegisterCard = () => useApiMutation((body: { uid?: string }) => api<StaffCardRecord>("/api/cards", { method: "POST", body }), { done: "Card added to stock", refresh: [["cards"]] });

/** One of the card's actions: issue, encode, reset or lost. */
export const useCardAction = (id: string) =>
  useApiMutation(({ action, body }: { action: "issue" | "encode" | "reset" | "lost"; body?: unknown }) => api<StaffCardRecord>(`/api/cards/${id}/${action}`, { method: "POST", body: body ?? {} }), { done: "Card updated", refresh: [["cards"]] });

export const useResolveCard = () => useApiMutation((scan: Scan) => api<{ card: StaffCardRecord; holder: StaffRef | null }>("/api/cards/resolve", { method: "POST", body: scan }), { done: "Card found", refresh: [] });
