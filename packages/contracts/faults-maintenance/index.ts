/**
 * Public contract of Faults & Maintenance (module 40). Other modules (such
 * as Inspections, when a check fails) raise a fault through `FaultReporter`,
 * never by writing Faults' tables.
 */

export const FAULT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type FaultPriority = (typeof FAULT_PRIORITIES)[number];

/** What another module sends to raise a fault. */
export interface FaultInput {
  title: string;
  description: string;
  location: string | null;
  department: string | null;
  priority: FaultPriority;
  photoIds: string[];
  /** The person who found it. */
  reporter: { userId: string; name: string; staffId: string | null };
  /** Where it came from, such as `inspections` and the inspection run's ID. */
  source: { module: string; recordId: string };
}

export interface FaultReporter {
  /** Raises a fault and returns its ID and number, such as `FLT-0042`. */
  report(input: FaultInput): Promise<{ faultId: string; number: string }>;
}

/** Events this module emits. */
export const FAULT_EVENTS = {
  reported: "fault.reported",
  assigned: "fault.assigned",
  fixed: "fault.fixed",
} as const;
