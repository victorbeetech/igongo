/**
 * HR Records' own Postgres schema, `hr`. No other module reads these
 * tables; they use the StaffDirectory contract. Change this file, then run
 * `pnpm db:generate` to write the next migration.
 */

import { STAFF_STATUSES } from "@igongo/contracts/hr-records";
import { index, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const hrSchema = pgSchema("hr");

/** active, suspended or left. */
export const staffStatus = hrSchema.enum("staff_status", STAFF_STATUSES);

/** One row per staff member, kept for ever (people who left stay, marked `left`). */
export const staff = hrSchema.table(
  "staff",
  {
    staffId: text("staff_id").primaryKey(),
    /** IGG-0042: printed on the card, never reused. */
    staffNumber: text("staff_number").notNull(),
    /** The sign-in account (Users & Login), once linked. */
    userId: text("user_id"),
    name: text("name").notNull(),
    department: text("department"),
    jobTitle: text("job_title"),
    photoUrl: text("photo_url"),
    phone: text("phone"),
    email: text("email"),
    /** YYYY-MM-DD. */
    hireDate: text("hire_date"),
    emergencyContact: text("emergency_contact"),
    status: staffStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("staff_number_key").on(t.staffNumber),
    // One staff record per account.
    uniqueIndex("staff_user_id_key").on(t.userId),
    index("staff_department_idx").on(t.department),
  ],
);
