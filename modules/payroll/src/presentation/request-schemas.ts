/** Zod schemas for Payroll request bodies. */

import { z } from "zod";
import { DEDUCTION_KINDS } from "../domain/deduction-rule";
import { PAY_METHODS } from "../domain/pay-profile";

const ugx = z.number().int().min(0).max(1_000_000_000);
const line = z.object({ name: z.string().trim().min(1).max(80), amount: z.number().int().min(-1_000_000_000).max(1_000_000_000) });

/** `PUT /payroll/profiles/:staffId`. */
export const profileBody = z.object({
  basic: ugx,
  allowances: z.array(line.extend({ amount: ugx })).max(30).default([]),
  payMethod: z.enum(PAY_METHODS),
  account: z.string().trim().max(80).nullable().default(null),
  active: z.boolean().default(true),
});

/** `POST /payroll/runs`. */
export const runBody = z.object({ period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) });

/** `PUT /payroll/payslips/:id/adjustments`. */
export const adjustBody = z.object({ adjustments: z.array(line).max(30) });

/** `PUT /payroll/settings`. */
export const settingsBody = z.object({
  deductions: z
    .array(
      z.object({
        key: z.string().regex(/^[a-z0-9-]{2,40}$/),
        name: z.string().trim().min(1).max(60),
        kind: z.enum(DEDUCTION_KINDS),
        rate: z.number().min(0).max(100).default(0),
        amount: ugx.default(0),
        bands: z.array(z.object({ upTo: ugx.nullable(), rate: z.number().min(0).max(100) })).max(20).default([]),
        base: z.enum(["gross", "basic"]).default("gross"),
        employerRate: z.number().min(0).max(100).default(0),
      }),
    )
    .max(30),
  approverMustDiffer: z.boolean(),
});
