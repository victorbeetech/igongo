/** Input checks for the guest content routes: the whole document must match the shape exactly. */

import { z } from "zod";

/** A link target: an in-app route ("/food") or an https link, or empty for no tap. */
const linkTarget = z.string().trim().max(500).nullable();
/** A picture URL: https only, or empty for the placeholder. */
const imageUrl = z.string().trim().max(1000).url().startsWith("https://").nullable();
/** The fields every list item has. */
const base = { id: z.string().min(1).max(80), active: z.boolean(), sortOrder: z.number().int().min(0).max(100000) };

export const contentBody = z.object({
  texts: z.object({ greetingMorning: z.string().trim().max(60), greetingAfternoon: z.string().trim().max(60), greetingEvening: z.string().trim().max(60), welcomeLine: z.string().trim().max(60) }),
  banners: z.array(z.object({ ...base, title: z.string().trim().min(1).max(120), subtitle: z.string().trim().max(240).nullable(), imageUrl, linkTarget })).max(200),
  stories: z.array(z.object({ ...base, label: z.string().trim().min(1).max(40), imageUrl, iconName: z.string().trim().max(60).nullable(), linkTarget })).max(200),
  featuredStays: z.array(z.object({ ...base, title: z.string().trim().min(1).max(120), subtitle: z.string().trim().max(240).nullable(), imageUrl, linkTarget })).max(200),
  didYouKnow: z.array(z.object({ ...base, title: z.string().trim().min(1).max(120), body: z.string().trim().min(1).max(600) })).max(200),
  restaurantSlides: z.array(z.object({ ...base, outletName: z.string().trim().min(1).max(120), caption: z.string().trim().max(240).nullable(), imageUrl, linkTarget })).max(200),
});
