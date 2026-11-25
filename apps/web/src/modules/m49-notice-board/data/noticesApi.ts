"use client";
// Queries and changes for the Notice Board screens (S49-01 to S49-05).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A post. */
export interface Notice {
  id: string;
  title: string;
  body: string;
  authorName: string;
  audienceRoles: string[];
  pinned: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  createdAt: string;
}

/** A post on the board list, with its counts. */
export interface BoardNotice extends Notice {
  likes: number;
  comments: number;
  reads: number;
  likedByMe: boolean;
  readByMe: boolean;
}

/** The board-wide switches. */
export interface BoardSettings {
  commentsEnabled: boolean;
  likesEnabled: boolean;
  readReceipts: boolean;
}

export const useBoard = () =>
  useQuery({ queryKey: ["notices"], queryFn: () => api<{ items: BoardNotice[]; settings: BoardSettings; can: { post: boolean; like: boolean; comment: boolean } }>("/api/notices?limit=50") });

export const useNotice = (id: string) =>
  useQuery({ queryKey: ["notices", id], queryFn: () => api<{ notice: Notice; comments: { id: string; authorName: string; body: string; at: string }[]; likes: number; settings: BoardSettings }>(`/api/notices/${id}`), enabled: !!id });

export const usePublish = () =>
  useApiMutation((body: Pick<Notice, "title" | "body" | "audienceRoles" | "pinned" | "allowComments" | "allowLikes">) => api<Notice>("/api/notices", { method: "POST", body }), { done: "Posted", refresh: [["notices"]] });

export const useLike = () => useApiMutation((id: string) => api<{ liked: boolean; likes: number }>(`/api/notices/${id}/like`, { method: "POST" }), { done: "Thanks", refresh: [["notices"]] });

export const useCommentOn = (id: string) => useApiMutation((body: string) => api(`/api/notices/${id}/comments`, { method: "POST", body: { body } }), { done: "Comment added", refresh: [["notices", id]] });

export const useBoardSettings = () => useQuery({ queryKey: ["notices", "settings"], queryFn: () => api<BoardSettings>("/api/notices/settings") });

export const useSaveBoardSettings = () => useApiMutation((s: BoardSettings) => api<BoardSettings>("/api/notices/settings", { method: "PUT", body: s }), { done: "Board settings saved", refresh: [["notices"]] });
