/**
 * Port: turns roles into people. Implemented with the Roles & Permissions
 * module's public API when it is built; an in-memory version until then.
 */

/** Finds the people who hold roles. */
export interface AudienceDirectory {
  /** The IDs of everyone holding at least one of [roles]. */
  usersWithRoles(roles: string[]): Promise<string[]>;
}
