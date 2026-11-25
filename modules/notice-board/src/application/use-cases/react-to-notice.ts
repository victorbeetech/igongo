/**
 * Use cases: like and comment, each allowed only when the board-wide switch
 * and the post's own switch are both on.
 */

import { AppError, newId } from "@igongo/core";
import type { Notice } from "../../domain/notice";
import type { NoticeComment } from "../../domain/notice-comment";
import type { NoticesDeps } from "../notices-deps";

/** Likes or unlikes. @throws AppError `method_disabled` when likes are off */
export async function toggleLike(deps: NoticesDeps, notice: Notice, userId: string): Promise<{ liked: boolean; likes: number }> {
  const settings = await deps.settings.read();
  if (!settings.likesEnabled || !notice.allowLikes) throw new AppError("method_disabled", "Likes are switched off for this post.");
  const liked = await deps.notices.toggleLike(notice.id, userId, deps.change.now);
  return { liked, likes: await deps.notices.likeCount(notice.id) };
}

/** Adds a comment. @throws AppError `method_disabled` when comments are off */
export async function addComment(deps: NoticesDeps, notice: Notice, author: { userId: string; name: string }, body: string): Promise<NoticeComment> {
  const settings = await deps.settings.read();
  if (!settings.commentsEnabled || !notice.allowComments) throw new AppError("method_disabled", "Comments are switched off for this post.");
  const comment: NoticeComment = { id: newId("ncm"), noticeId: notice.id, authorId: author.userId, authorName: author.name, body, at: deps.change.now };
  await deps.notices.addComment(comment);
  return comment;
}
