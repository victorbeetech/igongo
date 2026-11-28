"use client";
// Queries and changes for the Menus pages (S61-01 to S61-04) and the guest's
// food pages (module 62 reads the menu through these too, by address only).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { MenuItem } from "@/shared/api/types/menuItem";
import type { MenuSettings } from "@/shared/api/types/menuSettings";
import type { Outlet } from "@/shared/api/types/outlet";

export const useOutlets = () => useQuery({ queryKey: ["menu", "outlets"], queryFn: () => api<{ items: Outlet[] }>("/api/menu/outlets") });

/** The menu of [outlet] (or all); [all] for staff, with hidden and switched-off items. */
export const useMenuItems = (outlet: string, all = false) =>
  useQuery({ queryKey: ["menu", "items", outlet, all], queryFn: () => api<{ items: MenuItem[] }>(`/api/menu/items?${new URLSearchParams({ ...(outlet ? { outlet } : {}), ...(all ? { all: "1" } : {}) }).toString()}`) });

export const useMenuSettings = () => useQuery({ queryKey: ["menu", "settings"], queryFn: () => api<MenuSettings>("/api/menu/settings") });

/** Adds a venue (super admin only). The key is made from the name by the API. */
export const useAddOutlet = () => useApiMutation((v: { name: string; clientVisible: boolean }) => api<Outlet>("/api/menu/outlets", { method: "POST", body: v }), { done: "Venue added", refresh: [["menu"]] });

/** Renames a venue or switches it on or off for guests (super admin only). */
export const useEditOutlet = () => useApiMutation((v: { key: string; patch: { name?: string; clientVisible?: boolean } }) => api<Outlet>(`/api/menu/outlets/${v.key}`, { method: "PATCH", body: v.patch }), { done: "Venue saved", refresh: [["menu"]] });

/** Removes a venue that has no dishes (super admin only). */
export const useRemoveOutlet = () => useApiMutation((key: string) => api<{ key: string }>(`/api/menu/outlets/${key}`, { method: "DELETE" }), { done: "Venue removed", refresh: [["menu"]] });

export const useAddItem = () => useApiMutation((i: Partial<MenuItem>) => api<MenuItem>("/api/menu/items", { method: "POST", body: i }), { done: "Item added", refresh: [["menu"]] });

export const useEditItem = () => useApiMutation((v: { id: string; patch: Partial<MenuItem> }) => api<MenuItem>(`/api/menu/items/${v.id}`, { method: "PATCH", body: v.patch }), { done: "Item saved", refresh: [["menu"]] });

export const useSetStock = () => useApiMutation((v: { id: string; inStock: boolean }) => api<MenuItem>(`/api/menu/items/${v.id}/stock`, { method: "POST", body: { inStock: v.inStock } }), { done: "Stock updated", refresh: [["menu"]] });
