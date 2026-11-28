// The calls the super admin's "Post an update" page makes to the Notifications
// API. A post goes to the people who hold the chosen roles: each gets an item
// in the Updates inbox, and their phones get a push.

import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** The push channels the API accepts (see PUSH_CHANNELS in the contracts). */
export const POST_CHANNELS = ["general", "work", "messages", "bookings", "urgent"] as const;
export type PostChannel = (typeof POST_CHANNELS)[number];

/** What the page sends: the roles to tell, and the words. */
export interface BroadcastInput {
  roles: string[];
  title: string;
  body: string;
  channel: PostChannel;
  link: string | null;
}

/** The API's answer: one result per phone that was tried. */
export interface BroadcastResult {
  results: { target: string; outcome: string; detail?: string }[];
}

/** Turns the page's roles text ("chef, gm") into a clean list of role keys. */
export function parseRoles(text: string): string[] {
  return [...new Set(text.split(",").map((r) => r.trim()).filter(Boolean))];
}

/** Posts the update to the people holding [input.roles]. */
export const usePostUpdate = () =>
  useApiMutation(
    (input: BroadcastInput) =>
      api<BroadcastResult>("/api/notifications/push/broadcast", {
        method: "POST",
        body: {
          target: { kind: "roles", roles: input.roles },
          title: input.title,
          body: input.body,
          channel: input.channel,
          ...(input.link ? { link: input.link } : {}),
        },
      }),
    { done: "Update posted", refresh: [] },
  );
