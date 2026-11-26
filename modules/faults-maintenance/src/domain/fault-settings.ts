/**
 * The super admin's switches for Faults & Maintenance (S40-06): the
 * categories (each sends its faults to a department), and whether people may
 * like and comment on fault reports.
 */

export interface FaultCategory {
  key: string;
  name: string;
  /** The department that fixes it, such as `maintenance`. */
  department: string | null;
}

export interface FaultSettings {
  categories: FaultCategory[];
  likesEnabled: boolean;
  commentsEnabled: boolean;
  /** Photos must be added to every report. */
  photoRequired: boolean;
}

export const DEFAULT_FAULT_SETTINGS: FaultSettings = { categories: [], likesEnabled: true, commentsEnabled: true, photoRequired: false };
