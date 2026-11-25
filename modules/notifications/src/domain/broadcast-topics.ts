/**
 * Which public broadcast topics a person's phone joins.
 *
 * Topics are only for broadcasts that are safe for everyone in them, because
 * a phone can join any topic it likes. Messages for one role or one person go
 * to their tokens from the server instead (see `PushTarget`).
 */

/** Everyone with the app. */
export const TOPIC_ALL = "all";
/** Everyone on staff, for hotel-wide staff announcements. */
export const TOPIC_STAFF = "staff";
/** Every client (guest), for offers and news. */
export const TOPIC_CLIENTS = "clients";

/** The topics for a person: `all`, plus `staff` or `clients`. */
export function broadcastTopics(person: { isStaff: boolean }): string[] {
  return [TOPIC_ALL, person.isStaff ? TOPIC_STAFF : TOPIC_CLIENTS];
}
