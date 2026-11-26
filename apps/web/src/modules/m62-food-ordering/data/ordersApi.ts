"use client";
// Queries and changes for the Food Ordering pages (S62-01 to S62-16). The
// menu, zones and tracking are read by address from their own modules.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { MenuItem } from "@/shared/api/types/menuItem";
import type { Outlet } from "@/shared/api/types/outlet";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Order, OrderStatus, OrderType } from "../domain/order";
import type { OrderingRules } from "../domain/orderingRules";

export const useClientOutlets = () => useQuery({ queryKey: ["menu", "outlets"], queryFn: () => api<{ items: Outlet[] }>("/api/menu/outlets") });

export const useOutletMenu = (outlet: string) => useQuery({ queryKey: ["menu", "items", outlet, false], queryFn: () => api<{ items: MenuItem[] }>(`/api/menu/items?outlet=${outlet}`), enabled: !!outlet });

export const useZones = () => useQuery({ queryKey: ["delivery", "zones"], queryFn: () => api<{ items: { zone: string; name: string; fee: number; minutes: number }[] }>("/api/delivery/zones") });

export const useOrderingRules = () => useQuery({ queryKey: ["orders", "rules"], queryFn: () => api<OrderingRules>("/api/orders/rules") });

export const useMyOrders = () => useQuery({ queryKey: ["orders", "mine"], queryFn: () => api<{ items: Order[] }>("/api/orders/mine"), refetchInterval: 20000 });

export const useBoard = (outlet: string) => useQuery({ queryKey: ["orders", "board", outlet], queryFn: () => api<{ items: Order[] }>(`/api/orders/board${outlet ? `?outlet=${outlet}` : ""}`), refetchInterval: 15000 });

/** A guest's delivery: status, rider, and the code to give at the door. */
export const useTrack = (orderId: string, on: boolean) =>
  useQuery({ queryKey: ["delivery", "track", orderId], queryFn: () => api<{ status: string; code: string; riderName: string | null; minutes: number }>(`/api/delivery/track/${orderId}`), enabled: on, refetchInterval: 15000 });

/** The cart as the API takes it. */
export interface CartBody {
  outlet: string;
  type: OrderType;
  lines: { itemId: string; quantity: number; options: string[] }[];
  arriveAt?: string;
  deliverTo?: { label: string; zone: string | null; lat: null; lng: null };
  notes?: string;
  allergies?: string;
  table?: string;
}

export const useQuote = () => useApiMutation((b: CartBody) => api<{ total: number; deliveryFee: number; readyAt: string }>("/api/orders/quote", { method: "POST", body: b }), { done: "Price checked", refresh: [] });

export const usePlaceOrder = () => useApiMutation((b: CartBody) => api<Order>("/api/orders", { method: "POST", body: b }), { done: "Order placed", refresh: [["orders"]] });

export const useMoveOrder = () => useApiMutation((v: { id: string; status: OrderStatus }) => api<Order>(`/api/orders/${v.id}/status`, { method: "POST", body: { status: v.status } }), { done: "Order updated", refresh: [["orders"]] });

export const useCancelOrder = () => useApiMutation((v: { id: string; reason: string }) => api<Order>(`/api/orders/${v.id}/cancel`, { method: "POST", body: { reason: v.reason } }), { done: "Order cancelled", refresh: [["orders"]] });

export const useSaveOrderingRules = () => useApiMutation((r: OrderingRules) => api<OrderingRules>("/api/orders/rules", { method: "PUT", body: r }), { done: "Ordering rules saved", refresh: [["orders", "rules"]] });
