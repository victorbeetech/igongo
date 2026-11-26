// One booking module's rules, as the API returns them.

export interface BookingRules {
  depositPercent: number;
  requireApproval: boolean;
  cancelHoursBefore: number;
  maxUnits: number;
}
