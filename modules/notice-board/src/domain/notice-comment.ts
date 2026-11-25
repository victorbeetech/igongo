/** A comment under a notice. */

export interface NoticeComment {
  id: string;
  noticeId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: Date;
}
