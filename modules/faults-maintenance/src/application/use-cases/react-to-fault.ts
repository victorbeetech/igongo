/**
 * Use cases: like and comment on a fault report, each allowed only while
 * the super admin's switch is on.
 */

import { AppError, newId } from "@igongo/core";
import type { Fault } from "../../domain/fault";
import type { FaultComment } from "../../domain/fault-comment";
import type { FaultsDeps } from "../faults-deps";

/** Likes or unlikes. @throws AppError `method_disabled` when likes are off */
export async function toggleFaultLike(deps: FaultsDeps, fault: Fault, userId: string): Promise<{ liked: boolean; likes: number }> {
  if (!(await deps.settings.read()).likesEnabled) throw new AppError("method_disabled", "Likes are switched off for fault reports.");
  const liked = await deps.faults.toggleLike(fault.id, userId, deps.change.now);
  return { liked, likes: await deps.faults.likeCount(fault.id) };
}

/** Adds a comment. @throws AppError `method_disabled` when comments are off */
export async function commentOnFault(deps: FaultsDeps, fault: Fault, author: { userId: string; name: string }, body: string): Promise<FaultComment> {
  if (!(await deps.settings.read()).commentsEnabled) throw new AppError("method_disabled", "Comments are switched off for fault reports.");
  const comment: FaultComment = { id: newId("fcm"), faultId: fault.id, authorId: author.userId, authorName: author.name, body, at: deps.change.now };
  await deps.faults.addComment(comment);
  return comment;
}
