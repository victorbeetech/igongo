"use client";
// Queries and changes for the Chat screens (S50-01 to S50-05). New messages
// are fetched every few seconds until the realtime service is added.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** How often an open chat checks for new messages. */
const POLL_MS = 4000;

/** A chat in my list. */
export interface ConversationItem {
  id: string;
  kind: "direct" | "group" | "desk";
  title: string | null;
  deskKey: string | null;
  lastMessageAt: string | null;
  lastPreview: string | null;
  members: { userId: string; name: string }[];
  unread: number;
}

/** A message. */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  fileIds: string[];
  at: string;
}

/** The super admin's chat switches. */
export interface ChatSettings {
  staffChat: boolean;
  groups: boolean;
  guestChat: boolean;
  desks: { key: string; name: string; roles: string[] }[];
  attachments: boolean;
  maxGroupSize: number;
}

export const useConversations = () =>
  useQuery({ queryKey: ["chat", "list"], queryFn: () => api<{ items: ConversationItem[]; settings: Omit<ChatSettings, "desks" | "maxGroupSize"> }>("/api/chat/conversations"), refetchInterval: POLL_MS * 3 });

export const useMessages = (id: string) =>
  useQuery({
    queryKey: ["chat", "messages", id],
    queryFn: () => api<{ conversation: ConversationItem; members: { userId: string; name: string }[]; items: ChatMessage[] }>(`/api/chat/conversations/${id}/messages?limit=200`),
    enabled: !!id,
    refetchInterval: POLL_MS,
  });

export const useDesks = () => useQuery({ queryKey: ["chat", "desks"], queryFn: () => api<{ items: { key: string; name: string }[] }>("/api/chat/desks") });

export const usePeople = (q: string) =>
  useQuery({ queryKey: ["chat", "people", q], queryFn: () => api<{ items: { userId: string; name: string; department: string | null; jobTitle: string | null }[] }>(`/api/chat/people?q=${encodeURIComponent(q)}`) });

export const useChatSettings = () => useQuery({ queryKey: ["chat", "settings"], queryFn: () => api<ChatSettings>("/api/chat/settings") });

export const useStartChat = () =>
  useApiMutation((body: { kind: "direct"; userId: string } | { kind: "group"; title: string; userIds: string[] }) => api<{ id: string }>("/api/chat/conversations", { method: "POST", body }), { done: "Chat opened", refresh: [["chat", "list"]] });

export const useOpenDesk = () => useApiMutation((key: string) => api<{ id: string }>(`/api/chat/desks/${key}`, { method: "POST" }), { done: "Chat opened", refresh: [["chat", "list"]] });

export const useSend = (id: string) => useApiMutation((body: string) => api(`/api/chat/conversations/${id}/messages`, { method: "POST", body: { body } }), { done: "Sent", refresh: [["chat", "messages", id], ["chat", "list"]] });

export const useMarkRead = (id: string) => useApiMutation(() => api(`/api/chat/conversations/${id}/read`, { method: "POST" }), { done: "Read", refresh: [["chat", "list"]] });

export const useSaveChatSettings = () => useApiMutation((s: ChatSettings) => api<ChatSettings>("/api/chat/settings", { method: "PUT", body: s }), { done: "Chat settings saved", refresh: [["chat"]] });
