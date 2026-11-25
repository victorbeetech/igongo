"use client";
// Queries and changes for the HR Records screens (S22-01 to S22-04, S22-08).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A full staff profile, as HR sees it. */
export interface StaffMember extends StaffRef {
  phone: string | null;
  email: string | null;
  hireDate: string | null;
  emergencyContact: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The fields HR fills in. */
export type StaffDraft = Partial<Pick<StaffMember, "name" | "department" | "jobTitle" | "phone" | "email" | "hireDate" | "emergencyContact" | "status" | "userId">>;

export const useStaffDirectory = (q: string, status: string) =>
  useQuery({ queryKey: ["hr-staff", q, status], queryFn: () => api<{ items: StaffMember[] }>(`/api/hr/staff?limit=100&q=${encodeURIComponent(q)}${status ? `&status=${status}` : ""}`) });

export const useStaffMember = (id: string) => useQuery({ queryKey: ["hr-staff", id], queryFn: () => api<StaffMember>(`/api/hr/staff/${id}`), enabled: !!id });

export const useMyProfile = () => useQuery({ queryKey: ["hr-staff", "me"], queryFn: () => api<StaffMember>("/api/hr/staff/me") });

export const useEnrolStaff = () => useApiMutation((draft: StaffDraft) => api<StaffMember>("/api/hr/staff", { method: "POST", body: draft }), { done: "Staff member enrolled", refresh: [["hr-staff"]] });

export const useUpdateStaff = (id: string) =>
  useApiMutation((draft: StaffDraft) => api<StaffMember>(`/api/hr/staff/${id}`, { method: "PATCH", body: draft }), { done: "Profile saved", refresh: [["hr-staff"]] });
