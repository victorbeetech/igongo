/**
 * Permission keys the Notice Board checks. The super admin decides per role
 * who can post, who can only read, who can comment and who can only like.
 */

export const NOTICE_PERMISSIONS = {
  view: "notice-board.posts.view",
  create: "notice-board.posts.create",
  /** Edit or pin anyone's post, and see read receipts. */
  edit: "notice-board.posts.edit",
  /** Remove anyone's post. */
  delete: "notice-board.posts.delete",
  like: "notice-board.posts.like",
  comment: "notice-board.posts.comment",
  /** The board-wide switches. */
  settings: "notice-board.settings.edit",
} as const;
