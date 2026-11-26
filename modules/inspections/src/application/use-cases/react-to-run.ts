/** Use cases: like and comment on an inspection run, while the switches are on. */

import { AppError, newId } from "@igongo/core";
import type { InspectionRun } from "../../domain/inspection-run";
import type { RunComment } from "../../domain/run-comment";
import type { InspectionsDeps } from "../inspections-deps";

/** @throws AppError `method_disabled` when likes are off */
export async function toggleRunLike(deps: InspectionsDeps, run: InspectionRun, userId: string): Promise<{ liked: boolean; likes: number }> {
  if (!(await deps.settings.read()).likesEnabled) throw new AppError("method_disabled", "Likes are switched off for checkups.");
  const liked = await deps.inspections.toggleLike(run.id, userId, deps.change.now);
  return { liked, likes: await deps.inspections.likeCount(run.id) };
}

/** @throws AppError `method_disabled` when comments are off */
export async function commentOnRun(deps: InspectionsDeps, run: InspectionRun, author: { userId: string; name: string }, body: string): Promise<RunComment> {
  if (!(await deps.settings.read()).commentsEnabled) throw new AppError("method_disabled", "Comments are switched off for checkups.");
  const comment: RunComment = { id: newId("icm"), runId: run.id, authorId: author.userId, authorName: author.name, body, at: deps.change.now };
  await deps.inspections.addComment(comment);
  return comment;
}
