/**
 * The super admin's board-wide switches (S49-05). When one is off, it is off
 * for every post, whatever the post says.
 */

export interface BoardSettings {
  commentsEnabled: boolean;
  likesEnabled: boolean;
  /** Show authors who has read their post. */
  readReceipts: boolean;
}

export const DEFAULT_BOARD_SETTINGS: BoardSettings = { commentsEnabled: true, likesEnabled: true, readReceipts: true };
