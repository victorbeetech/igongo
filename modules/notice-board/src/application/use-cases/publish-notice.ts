/** Use case: publish a new notice, record it and announce it by push. */

import { newId, recordChange } from "@igongo/core";
import type { Notice, NoticeDraft } from "../../domain/notice";
import type { NoticesDeps } from "../notices-deps";

export async function publishNotice(deps: NoticesDeps, author: { userId: string; name: string }, draft: NoticeDraft): Promise<Notice> {
  const now = deps.change.now;
  const notice: Notice = { id: newId("ntc"), ...draft, authorId: author.userId, authorName: author.name, createdAt: now, updatedAt: now, removedAt: null };
  await deps.notices.save(notice);
  await recordChange(deps.change, { module: "notice-board", action: "notice.published", recordType: "notice", recordId: notice.id, summary: `Posted "${notice.title}"` });
  // A failed push must not undo the post.
  await deps.announce(notice).catch(() => undefined);
  return notice;
}
