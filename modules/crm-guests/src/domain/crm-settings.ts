/** The super admin's CRM options (S54-08), kept as data. */

export interface CrmSettings {
  /** Tags staff can put on guests. */
  tags: string[];
}

export const DEFAULT_CRM_SETTINGS: CrmSettings = { tags: ["vip", "regular", "corporate", "school", "government", "wedding-client"] };
