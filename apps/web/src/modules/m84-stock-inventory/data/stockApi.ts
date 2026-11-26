"use client";
// Queries and changes for the Stock & Inventory pages (S84-01 to S84-20).
// Every change refreshes the whole stock cache, so balances stay true.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Balance } from "../domain/balance";
import type { Movement, MovementKind } from "../domain/movement";
import { STOCK_PATH } from "../domain/place";
import type { StockItem } from "../domain/stockItem";
import type { StockSettings } from "../domain/stockSettings";
import type { Store } from "../domain/store";

/** Everything here shares one cache key, refreshed after each change. */
const KEY = "stock";
const refresh = [[KEY]];

export const useStores = () => useQuery({ queryKey: [KEY, "stores"], queryFn: () => api<{ items: Store[] }>(`${STOCK_PATH}/stores`) });

export const useItems = (q: string) =>
  useQuery({ queryKey: [KEY, "items", q], queryFn: () => api<{ items: StockItem[] }>(`${STOCK_PATH}/items${q ? `?q=${encodeURIComponent(q)}` : ""}`) });

export const useItem = (id: string) =>
  useQuery({ queryKey: [KEY, "item", id], queryFn: () => api<{ item: StockItem & { qr: string }; balances: Balance[]; movements: Movement[] }>(`${STOCK_PATH}/items/${id}`), enabled: !!id });

export const useLow = () => useQuery({ queryKey: [KEY, "low"], queryFn: () => api<{ items: StockItem[] }>(`${STOCK_PATH}/low`) });

export const useMovements = (kind: MovementKind | "") =>
  useQuery({ queryKey: [KEY, "movements", kind], queryFn: () => api<{ items: Movement[] }>(`${STOCK_PATH}/movements${kind ? `?kind=${kind}` : ""}`), refetchInterval: 30000 });

export const useStockSettings = () => useQuery({ queryKey: [KEY, "settings"], queryFn: () => api<StockSettings>(`${STOCK_PATH}/settings`) });

export const useSaveStockSettings = () => useApiMutation((b: StockSettings) => api<StockSettings>(`${STOCK_PATH}/settings`, { method: "PUT", body: b }), { done: "Stock settings saved", refresh });

/** The body of a new store. */
export interface StoreInput {
  name: string;
  kind: string;
  department: string | null;
  keeperStaffId: string | null;
  location: string | null;
}

export const useAddStore = () => useApiMutation((b: StoreInput) => api<Store>(`${STOCK_PATH}/stores`, { method: "POST", body: b }), { done: "Store added", refresh });

export const useEditStore = () => useApiMutation(({ id, ...b }: Partial<Store> & { id: string }) => api<Store>(`${STOCK_PATH}/stores/${id}`, { method: "PATCH", body: b }), { done: "Store saved", refresh });

/** The body of a new or changed item. */
export interface ItemInput {
  code: string;
  name: string;
  category: string;
  unit: string;
  conversions: { unit: string; per: number }[];
  reorderLevel: number;
  tracksExpiry: boolean;
}

export const useAddItem = () => useApiMutation((b: ItemInput) => api<StockItem>(`${STOCK_PATH}/items`, { method: "POST", body: b }), { done: "Item added", refresh });

export const useEditItem = () => useApiMutation(({ id, ...b }: Partial<ItemInput> & { id: string; active?: boolean }) => api<StockItem>(`${STOCK_PATH}/items/${id}`, { method: "PATCH", body: b }), { done: "Item saved", refresh });

/** The body of one movement. */
export interface MovementInput {
  kind: Exclude<MovementKind, "count">;
  itemId: string;
  qty: number;
  unit?: string;
  fromStoreId?: string | null;
  toStoreId?: string | null;
  unitCost?: number;
  reference?: string | null;
  issuedTo?: string | null;
  note?: string | null;
}

export const usePostMovement = () => useApiMutation((b: MovementInput) => api<Movement>(`${STOCK_PATH}/movements`, { method: "POST", body: b }), { done: "Saved to the stock ledger", refresh });

export const useCount = () =>
  useApiMutation((b: { itemId: string; storeId: string; counted: number; note?: string | null }) => api<Movement | null>(`${STOCK_PATH}/counts`, { method: "POST", body: b }), { done: "Count saved", refresh });
