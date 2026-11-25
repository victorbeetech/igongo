/** Use case: edit or remove a notice. Authors may change their own; editors any. */

import { AppError, recordChange } from "@igongo/core";
import type { Notice, NoticeDraft } from "../../domain/notice";
import type { NoticesDeps } from "../notices-deps";

/** @throws AppError `not_found` for missing or removed posts */
export async function changeNotice(deps: NoticesDeps, notice: Notice | null, change: { edit?: Partial<NoticeDraft>; remove?: boolean }): Promise<Notice> {
  if (!notice || notice.removedAt) throw new AppError("not_found", "Post not found.");
  const now = deps.change.now;
  const next: Notice = { ...notice, ...(change.edit ?? {}), updatedAt: now, removedAt: change.remove ? now : null };
  await deps.notices.save(next);
  await recordChange(deps.change, {
    module: "notice-board",
    action: change.remove ? "notice.removed" : "notice.edited",
    recordType: "notice",
    recordId: notice.id,
    summary: `${change.remove ? "Removed" : "Edited"} the post "${notice.title}"`,
  });
  return next;
}
