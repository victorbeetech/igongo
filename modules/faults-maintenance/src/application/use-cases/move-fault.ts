/**
 * Use cases: assign a fault to a technician, and move it along its life
 * (S40-03). Every move is kept in the fault's history and the Audit Trail.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import type { Fault, FaultPerson } from "../../domain/fault";
import { canMove, type FaultStatus } from "../../domain/fault-status";
import type { FaultsDeps } from "../faults-deps";

/** Saves [next] and records the step from [fault]'s status. */
async function step(deps: FaultsDeps, fault: Fault, next: Fault, by: { userId: string; name: string }, note: string | null, summary: string): Promise<Fault> {
  await deps.faults.save(next);
  await deps.faults.addEvent({ id: newId("fev"), faultId: fault.id, byId: by.userId, byName: by.name, from: fault.status, to: next.status, note, at: deps.change.now });
  await recordChange(deps.change, { module: "faults-maintenance", action: `fault.${next.status}`, recordType: "fault", recordId: fault.id, summary });
  return next;
}

/** Gives [fault] to the staff member [staffId]. @throws AppError for closed faults or unknown staff */
export async function assignFault(deps: FaultsDeps, fault: Fault, staffId: string, by: { userId: string; name: string }, note: string | null): Promise<Fault> {
  if (fault.status === "closed" || fault.status === "cancelled") throw new AppError("conflict", "This fault is already closed.");
  const person = await deps.staff.byId(staffId);
  if (!person || person.status !== "active") throw new AppError("bad_request", "Choose an active staff member.");
  const assignedTo: FaultPerson = { userId: person.userId, staffId: person.staffId, name: person.name };
  const next: Fault = { ...fault, assignedTo, status: fault.status === "open" ? "assigned" : fault.status, updatedAt: deps.change.now };
  return step(deps, fault, next, by, note, `Assigned ${fault.number} to ${person.name}`);
}

/** Moves [fault] to [to]. @throws AppError `conflict` for a move its life does not allow */
export async function moveFault(deps: FaultsDeps, fault: Fault, to: FaultStatus, by: { userId: string; name: string }, note: string | null): Promise<Fault> {
  if (!canMove(fault.status, to)) throw new AppError("conflict", `A ${fault.status.replace("_", " ")} fault cannot become ${to.replace("_", " ")}.`);
  if (to === "fixed" && !note) throw new AppError("bad_request", "Say what was done to fix it.");
  const now = deps.change.now;
  const next: Fault = {
    ...fault,
    status: to,
    updatedAt: now,
    fixNote: to === "fixed" ? note : fault.fixNote,
    fixedAt: to === "fixed" ? now : to === "in_progress" ? null : fault.fixedAt,
    closedAt: to === "closed" ? now : null,
  };
  return step(deps, fault, next, by, note, `${fault.number} is now ${to.replace("_", " ")}${note ? `: ${note}` : ""}`);
}
