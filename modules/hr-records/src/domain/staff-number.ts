/**
 * Staff numbers: the hotel prefix and a running number, such as `IGG-0042`.
 * They are printed on cards, so they are never reused.
 */

/** The prefix on every staff number. */
export const STAFF_NUMBER_PREFIX = "IGG-";

/**
 * The number after [highest] (the highest number given so far, or 0).
 * @example nextStaffNumber(41) === "IGG-0042"
 */
export function nextStaffNumber(highest: number): string {
  return `${STAFF_NUMBER_PREFIX}${String(highest + 1).padStart(4, "0")}`;
}

/** The running number inside [staffNumber], or 0 when it has another form. */
export function staffNumberValue(staffNumber: string): number {
  const match = /^IGG-(\d+)$/.exec(staffNumber);
  return match ? Number(match[1]) : 0;
}
