/** Permission keys the Audit Trail checks. The super admin gives them to roles. */

export const AUDIT_PERMISSIONS = {
  /** Search entries and see a record's timeline. */
  view: "audit-trail.entries.view",
  /** Check the hash chain for tampering. */
  verify: "audit-trail.chain.view",
} as const;
