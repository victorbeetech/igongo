"use client";
// Queries and changes for the card design pages (S16-02 to S16-07).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { CardDesigns } from "../domain/cardDesigns";

export const useCardDesigns = () => useQuery({ queryKey: ["card-designs"], queryFn: () => api<CardDesigns>("/api/cards/designs") });

export const useSaveCardDesigns = () => useApiMutation((b: CardDesigns) => api<CardDesigns>("/api/cards/designs", { method: "PUT", body: b }), { done: "Card designs saved", refresh: [["card-designs"]] });
