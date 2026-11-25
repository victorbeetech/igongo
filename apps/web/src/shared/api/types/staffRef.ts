// A staff member as every staff module's API returns them (the HR Records
// contract, packages/contracts/hr-records). Shared by every web module that
// shows a person.

export interface StaffRef {
  staffId: string;
  userId: string | null;
  staffNumber: string;
  name: string;
  department: string | null;
  jobTitle: string | null;
  photoUrl: string | null;
  status: "active" | "suspended" | "left";
}

/** "Sam · IGG-0001 · kitchen", for list rows. */
export function staffLine(s: StaffRef | null | undefined): string {
  if (!s) return "Unknown";
  return [s.name, s.staffNumber, s.department].filter(Boolean).join(" · ");
}
