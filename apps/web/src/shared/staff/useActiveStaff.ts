"use client";
// The active staff list from HR Records, for pickers in any module.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";

/** Everyone active (up to 200), cached under the HR key every module shares. */
export const useActiveStaff = () => useQuery({ queryKey: ["hr-staff", "active"], queryFn: () => api<{ items: StaffRef[] }>("/api/hr/staff?status=active&limit=200") });
