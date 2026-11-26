/**
 * The permission keys of one records module, built from its key, such as
 * `lost-found.records.create`. The super admin gives them to roles, each
 * with a data scope: `own` reaches only the caller's own records, wider
 * scopes reach everyone's (staff tools).
 */

export function recordPermissions(moduleKey: string) {
  return {
    /** Own: my records. Wider: every record (the module's lists and boards). */
    view: `${moduleKey}.records.view`,
    /** Own: raise self-service types for myself. Wider: add any type, for anyone. */
    create: `${moduleKey}.records.create`,
    /** Wider: edit, assign and move records through their statuses. */
    edit: `${moduleKey}.records.edit`,
    /** Move records into statuses marked "approval". */
    approve: `${moduleKey}.records.approve`,
    /** Download records as a spreadsheet. */
    export: `${moduleKey}.records.export`,
    /** Comment on records the caller can see. */
    comment: `${moduleKey}.records.comment`,
    /** The module's record types, fields, statuses and switches. */
    settings: `${moduleKey}.settings.edit`,
  } as const;
}
