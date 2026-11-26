/** A comment under a fault report. */

export interface FaultComment {
  id: string;
  faultId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: Date;
}
