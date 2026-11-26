/**
 * Use case: report a fault (S40-01), from a person or from another module
 * (an inspection's failed check). Steps: check the photos, pick the
 * department from the category, number it, save it with its first history
 * step, audit it.
 */

import type { FaultInput } from "@igongo/contracts/faults-maintenance";
import { AppError, newId, recordChange } from "@igongo/core";
import type { Fault } from "../../domain/fault";
import type { FaultsDeps } from "../faults-deps";

export async function reportFault(deps: FaultsDeps, input: FaultInput & { category: string | null }): Promise<Fault> {
  const settings = await deps.settings.read();
  // 1. Photos must exist in Files & Media.
  const photos = await deps.files.known(input.photoIds);
  if (photos.length !== new Set(input.photoIds).size) throw new AppError("bad_request", "One of the photos was not found. Upload it again.");
  if (settings.photoRequired && photos.length === 0 && input.source.module === "staff") throw new AppError("bad_request", "Add a photo of the fault.");
  // 2. The category decides who fixes it; otherwise the reporter's department.
  const category = input.category ? settings.categories.find((c) => c.key === input.category) : null;
  if (input.category && !category) throw new AppError("bad_request", "Unknown fault category.");
  const now = deps.change.now;
  const fault: Fault = {
    id: newId("flt"),
    number: await deps.faults.nextNumber(),
    title: input.title,
    description: input.description,
    category: category?.key ?? null,
    location: input.location,
    department: category?.department ?? input.department,
    priority: input.priority,
    status: "open",
    photoIds: photos.map((p) => p.id),
    reportedBy: input.reporter,
    assignedTo: null,
    sourceModule: input.source.module,
    sourceRecordId: input.source.module === "staff" ? null : input.source.recordId,
    fixNote: null,
    createdAt: now,
    updatedAt: now,
    fixedAt: null,
    closedAt: null,
  };
  // 3. Save, with the first history step.
  await deps.faults.save(fault);
  await deps.faults.addEvent({ id: newId("fev"), faultId: fault.id, byId: input.reporter.userId, byName: input.reporter.name, from: null, to: "open", note: null, at: now });
  await recordChange(deps.change, { module: "faults-maintenance", action: "fault.reported", recordType: "fault", recordId: fault.id, summary: `Reported ${fault.number}: ${fault.title}${fault.location ? ` at ${fault.location}` : ""}` });
  return fault;
}
