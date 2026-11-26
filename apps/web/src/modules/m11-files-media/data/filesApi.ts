"use client";
// Queries and changes for the Files & Media settings (S11-04): the largest
// upload and the file types allowed.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** The upload limits. */
export interface FileRules {
  maxMb: number;
  allowedTypes: string[];
}

export const useFileRules = () => useQuery({ queryKey: ["files", "settings"], queryFn: () => api<FileRules>("/api/files/settings") });

export const useSaveFileRules = () => useApiMutation((r: FileRules) => api<FileRules>("/api/files/settings", { method: "PUT", body: r }), { done: "File settings saved", refresh: [["files"]] });
