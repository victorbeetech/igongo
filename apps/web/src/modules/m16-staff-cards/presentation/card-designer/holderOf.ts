// A picked staff member's details in the shape a card draws them.

import type { StaffRef } from "@/shared/api/types/staffRef";
import { SAMPLE_HOLDER, type CardHolder } from "../../domain/cardHolder";

export function holderOf(s: StaffRef | undefined): CardHolder {
  if (!s) return SAMPLE_HOLDER;
  return {
    ...SAMPLE_HOLDER,
    full_name: s.name,
    role: s.jobTitle ?? "",
    department: s.department ?? "",
    staff_no: s.staffNumber,
    photoUrl: s.photoUrl,
    qr: `IGG-STAFF:${s.staffNumber}`,
  };
}
