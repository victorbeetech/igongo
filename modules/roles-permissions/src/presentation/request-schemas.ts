/** Zod schemas for Roles & Permissions request bodies and queries. */

import { z } from "zod";
import { DATA_SCOPES } from "@igongo/contracts/roles-permissions";

const key = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase words joined by dashes").max(60);
const permission = z.object({ key: z.string().max(120), scope: z.enum(DATA_SCOPES) });
const rules = z.object({ approvalLimits: z.array(z.string().max(300)).max(30), extraRules: z.array(z.string().max(300)).max(30) });

/** Editable role fields (all optional when editing). */
const draft = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().max(1000),
  level: z.string().max(60),
  department: z.string().max(80).nullable(),
  color: z.string().max(40).nullable(),
  icon: z.string().max(40).nullable(),
  isStaff: z.boolean(),
  reportsToRoleId: z.string().max(80).nullable(),
  homeTiles: z.array(z.string().max(80)).max(24),
  rules,
});

/** `POST /roles`. */
export const createRoleBody = draft.partial().extend({ key, name: draft.shape.name, cloneFromRoleId: z.string().max(80).optional() });

/** `PATCH /roles/:id`. */
export const updateRoleBody = draft.partial().extend({
  permissions: z.array(permission).max(2000).optional(),
  includedRoleIds: z.array(z.string().max(80)).max(50).optional(),
});

/** `POST /users/:userId/roles`. */
export const assignBody = z.object({
  roleId: z.string().max(80),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
});

/** `GET /roles?archived=true`. */
export const listQuery = z.object({ archived: z.enum(["true", "false"]).default("false") });

/** `GET /report/who-can?permission=...`. */
export const whoCanQuery = z.object({ permission: z.string().max(120) });
