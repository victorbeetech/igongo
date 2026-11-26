/** A comment under an inspection run. */

export interface RunComment {
  id: string;
  runId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: Date;
}
