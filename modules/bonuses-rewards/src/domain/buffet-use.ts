/** One buffet pass used: whose, when, and who served it. */

export interface BuffetUse {
  id: string;
  bonusId: string;
  staffId: string;
  /** The hotel day, `YYYY-MM-DD`. */
  workDate: string;
  servedByName: string;
  at: Date;
}
