/** Where notices, likes, comments and reads are kept. */

import type { Notice } from "../../domain/notice";
import type { NoticeComment } from "../../domain/notice-comment";

/** Who is reading the board. */
export interface NoticeViewer {
  userId: string;
  roleKeys: string[];
  isStaff: boolean;
}

/** A notice with its counts, for the board list. */
export interface NoticeWithCounts extends Notice {
  likes: number;
  comments: number;
  reads: number;
}

export interface NoticeRepository {
  get(id: string): Promise<Notice | null>;
  /**
   * Live posts [viewer] may see (see `canSee`), pinned first, newest first,
   * with counts and the viewer's own like and read.
   */
  list(viewer: NoticeViewer, limit: number, offset: number): Promise<(NoticeWithCounts & { likedByMe: boolean; readByMe: boolean })[]>;
  save(notice: Notice): Promise<void>;
  /** Adds or removes [userId]'s like; returns true when it is now liked. */
  toggleLike(noticeId: string, userId: string, now: Date): Promise<boolean>;
  likeCount(noticeId: string): Promise<number>;
  addComment(comment: NoticeComment): Promise<void>;
  comments(noticeId: string): Promise<NoticeComment[]>;
  /** Marks read once (the first read time is kept). */
  markRead(noticeId: string, userId: string, now: Date): Promise<void>;
  reads(noticeId: string): Promise<{ userId: string; at: Date }[]>;
}
