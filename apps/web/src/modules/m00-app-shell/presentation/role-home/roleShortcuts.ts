// The shortcuts under every staff home. Guests do not see them.

/** Each shortcut: its words and the screen or dialog it opens. */
export const STAFF_SHORTCUTS = [
  { label: "Approvals inbox", targetId: "S00-30" },
  { label: "Notice board", targetId: "S49-01" },
  { label: "Switch to client view", targetId: "D00-02" },
  { label: "Panic button", targetId: "S00-24" },
] as const;
