/**
 * A checklist (S39-01) the super admin or an HOD builds, such as "Kitchen
 * opening check", for one department, done daily or weekly.
 */

import type { ChecklistItem } from "./checklist-item";

export const FREQUENCIES = ["daily", "weekly"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export interface Checklist {
  id: string;
  name: string;
  /** The department it is for; its HOD (and anyone given the scope) does it. */
  department: string;
  frequency: Frequency;
  /** By when it should be done, `HH:MM` hotel time. */
  dueBy: string;
  items: ChecklistItem[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** The fields a builder writes. */
export type ChecklistDraft = Pick<Checklist, "name" | "department" | "frequency" | "dueBy" | "items" | "active">;
