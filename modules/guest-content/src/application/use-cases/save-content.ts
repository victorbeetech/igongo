/**
 * Saves the whole guest content document and records the change in the audit
 * trail, with the list sizes so the audit entry reads clearly.
 */

import { recordChange } from "@igongo/core";
import { CONTENT_LISTS, type GuestContent } from "../../domain/content";
import type { GuestContentDeps } from "../guest-content-deps";

/** Saves [content] and returns it. */
export async function saveContent(deps: GuestContentDeps, content: GuestContent): Promise<GuestContent> {
  const { store, change } = deps;
  await store.write(content, change.actorId, change.now);
  // A short, plain summary for the audit screen: how many items each list holds.
  const counts = CONTENT_LISTS.map((k) => `${k}: ${content[k].length}`).join(", ");
  await recordChange(change, {
    module: "guest-content",
    action: "guest_content.saved",
    recordType: "guest_content",
    recordId: "guest-content",
    summary: `Guest app content saved (${counts})`,
  });
  return content;
}
