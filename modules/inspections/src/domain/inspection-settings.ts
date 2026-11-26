/** The super admin's switches for Inspections: likes and comments on runs. */

export interface InspectionSettings {
  likesEnabled: boolean;
  commentsEnabled: boolean;
}

export const DEFAULT_INSPECTION_SETTINGS: InspectionSettings = { likesEnabled: true, commentsEnabled: true };
