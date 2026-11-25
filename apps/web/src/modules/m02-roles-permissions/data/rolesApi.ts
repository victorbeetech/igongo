"use client";
// Queries and changes for the Roles & Permissions screens (S02-01 to S02-11).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** One permission a role gives. */
export interface RolePermission {
  key: string;
  scope: string;
}

/** A role, as the API returns it. */
export interface Role {
  id: string;
  key: string;
  name: string;
  description: string;
  level: string;
  isStaff: boolean;
  isPremade: boolean;
  archivedAt: string | null;
  homeTiles: string[];
  permissions: RolePermission[];
  includedRoleIds: string[];
  holders?: { userId: string; startsAt: string | null; endsAt: string | null }[];
}

/** The role builder's catalogue: modules, actions and scopes. */
export interface AccessCatalog {
  modules: { number: number; key: string; name: string; group: string }[];
  actions: string[];
  scopes: string[];
}

export const useRoles = () => useQuery({ queryKey: ["roles"], queryFn: () => api<{ items: Role[] }>("/api/access/roles") });

export const useRole = (id: string) => useQuery({ queryKey: ["roles", id], queryFn: () => api<Role>(`/api/access/roles/${id}`), enabled: !!id });

export const useAccessCatalog = () => useQuery({ queryKey: ["access-catalog"], queryFn: () => api<AccessCatalog>("/api/access/catalog"), staleTime: Infinity });

export const useCreateRole = () =>
  useApiMutation((body: { key: string; name: string; description?: string; cloneFromRoleId?: string }) => api<Role>("/api/access/roles", { method: "POST", body }), {
    done: "Role created",
    refresh: [["roles"]],
  });

export const useUpdateRole = (id: string) =>
  useApiMutation((body: Partial<Pick<Role, "name" | "description" | "permissions" | "homeTiles">>) => api<Role>(`/api/access/roles/${id}`, { method: "PATCH", body }), {
    done: "Role saved",
    refresh: [["roles"]],
  });

export const useAssignRole = (roleId: string) =>
  useApiMutation(({ userId, endsAt }: { userId: string; endsAt?: string }) => api(`/api/access/users/${userId}/roles`, { method: "POST", body: { roleId, ...(endsAt ? { endsAt } : {}) } }), {
    done: "Role given",
    refresh: [["roles", roleId]],
  });

export const useUnassignRole = (roleId: string) =>
  useApiMutation((userId: string) => api(`/api/access/users/${userId}/roles/${roleId}`, { method: "DELETE" }), { done: "Role taken away", refresh: [["roles", roleId]] });

export const useWhoCan = (permission: string) =>
  useQuery({
    queryKey: ["who-can", permission],
    queryFn: () => api<{ items: { roleId: string; roleName: string; grantedBy: string; scope: string; holders: string[] }[] }>(`/api/access/report/who-can?permission=${encodeURIComponent(permission)}`),
    enabled: /^[a-z0-9-]+\.[a-z0-9-]+\.[a-z0-9-]+$/.test(permission),
  });
