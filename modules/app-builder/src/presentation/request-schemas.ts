/** Zod schemas for App Layout's request bodies. */

import { z } from "zod";

const key = z.string().trim().min(1).max(80);

/** `PUT /roles/:roleId`. */
export const layoutBody = z.object({
  menu: z.array(key).max(120).default([]),
  hidden: z.array(key).max(120).default([]),
  tabs: z.array(z.string().regex(/^S\d{2}-\d{2}$/)).max(5).default([]),
  tiles: z.array(key).max(24).default([]),
});

/** `PUT /settings`. */
export const settingsBody = z.object({
  publicModules: z.array(key).max(120),
  clientViewRoles: z.array(key).max(200),
  markTestOrders: z.boolean(),
});
