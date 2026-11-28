// The booking rules as plain text, for people who may see the settings but not change
// them. The same numbers the form shows, read-only.

import { Card } from "@/shared/ui/card/Card";
import type { BookingRules } from "../../types/bookingRules";

/** The saved rules, read-only. */
export function RulesView({ rules }: { rules: BookingRules }) {
  return (
    <Card className="grid gap-1">
      <p className="text-body">Deposit: {rules.depositPercent}% of the total</p>
      <p className="text-body">Cancel up to: {rules.cancelHoursBefore} hours before</p>
      <p className="text-body">Most per booking: {rules.maxUnits}</p>
      <p className="text-body">Staff approve every booking: {rules.requireApproval ? "Yes" : "No"}</p>
    </Card>
  );
}
