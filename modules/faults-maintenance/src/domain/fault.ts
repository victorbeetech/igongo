/** A fault report (S40-01): something broken, with photos, where and how urgent. */

import type { FaultPriority } from "@igongo/contracts/faults-maintenance";
import type { FaultStatus } from "./fault-status";

/** A person as the fault shows them. */
export interface FaultPerson {
  userId: string | null;
  staffId: string | null;
  name: string;
}

export interface Fault {
  id: string;
  /** Such as `FLT-0042`. */
  number: string;
  title: string;
  description: string;
  /** A category key from the super admin's list, or null. */
  category: string | null;
  location: string | null;
  /** The department it belongs to (decides who sees it with a department scope). */
  department: string | null;
  priority: FaultPriority;
  status: FaultStatus;
  photoIds: string[];
  reportedBy: FaultPerson;
  assignedTo: FaultPerson | null;
  /** Where it came from: `staff` for a person's report, or a module key such as `inspections`. */
  sourceModule: string;
  sourceRecordId: string | null;
  /** What the technician did, when fixed. */
  fixNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  fixedAt: Date | null;
  closedAt: Date | null;
}
