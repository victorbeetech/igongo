/** Who a push goes to. */

/**
 * The target of a push.
 *
 * - `users`: every phone of these people (the usual case).
 * - `roles`: every phone of every person holding one of these roles. Resolved
 *   to people on the server, never sent to a topic, because anyone can join a
 *   topic from a phone and role messages may be private.
 * - `topic`: a public broadcast topic, such as `all` or `clients`.
 */
export type PushTarget =
  | { kind: "users"; userIds: string[] }
  | { kind: "roles"; roles: string[] }
  | { kind: "topic"; topic: string };
