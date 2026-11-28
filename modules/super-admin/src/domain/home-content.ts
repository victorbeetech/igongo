/**
 * The guest home's content, edited by the super admin in the "home" settings
 * section. Every item can be switched off or removed, so the app shows only what
 * the hotel has entered. Nothing here is sample data: the defaults hold only the
 * five quick actions the home has always shown (their words and screens) and
 * empty lists for stories and hero slides.
 *
 * Images are web addresses (https://...) or an empty string for no picture.
 * Screen IDs use the catalogue form S00-00; an empty screen ID opens the
 * "coming soon" page for that service.
 */

import { z } from "zod";

/** The icon names the apps know how to draw. Add a name here and in the app's icon map together. */
export const HOME_ICON_KEYS = ["star", "sunny", "pool", "restaurant", "terrain", "music", "bar", "spa", "hotel", "museum", "events", "shop"] as const;

/** A picture address (https) or "" for none. */
const imageUrl = z.string().max(500).regex(/^(https:\/\/\S+)?$/, "must be an https address or empty");

/** A catalogue screen ID such as S67-01, or "" for the coming-soon page. */
const screenId = z.string().regex(/^(S\d{2}-\d{2})?$/, "must look like S67-01 or be empty");

/** One "Happening today" bubble. */
export const homeStory = z.object({
  enabled: z.boolean(),
  title: z.string().min(1).max(40),
  /** The time or a short line under the title, such as "10:00". */
  subtitle: z.string().max(40),
  icon: z.enum(HOME_ICON_KEYS),
  imageUrl,
});

/** One slide of the hero carousel. */
export const homeHeroSlide = z.object({
  enabled: z.boolean(),
  tag: z.string().max(30),
  eyebrow: z.string().max(30),
  title: z.string().min(1).max(60),
  description: z.string().max(120),
  price: z.string().max(60),
  imageUrl,
});

/** One quick-action card under the hero. */
export const homeQuickAction = z.object({
  enabled: z.boolean(),
  title: z.string().min(1).max(20),
  subtitle: z.string().max(40),
  icon: z.enum(HOME_ICON_KEYS),
  screenId,
});

/** The whole "home" section: each block has its own switch, and the lists have a size limit. */
export const homeSection = z.object({
  stories: z.object({ enabled: z.boolean(), items: z.array(homeStory).max(12) }),
  hero: z.object({ enabled: z.boolean(), slides: z.array(homeHeroSlide).max(6) }),
  quickActions: z.object({ enabled: z.boolean(), items: z.array(homeQuickAction).max(6) }),
  /** The "From our kitchen" row. Its dishes come from the menu; this switch only shows or hides the row. */
  restaurant: z.object({ enabled: z.boolean() }),
  /** The floating WhatsApp button on guest screens. The number is set under the hotel profile. */
  whatsappButton: z.object({ enabled: z.boolean() }),
});

export type HomeSection = z.infer<typeof homeSection>;

/** The starting home content: the five quick actions as the home has always shown them, and nothing else. */
export const HOME_DEFAULTS: HomeSection = {
  stories: { enabled: true, items: [] },
  hero: { enabled: true, slides: [] },
  quickActions: {
    enabled: true,
    items: [
      { enabled: true, title: "Book stay", subtitle: "Rooms and huts", icon: "hotel", screenId: "S67-01" },
      { enabled: true, title: "Dine in", subtitle: "Reserve table", icon: "restaurant", screenId: "S62-01" },
      { enabled: true, title: "Museum", subtitle: "Cultural tour", icon: "museum", screenId: "S68-01" },
      { enabled: true, title: "Spa", subtitle: "Massage and steam", icon: "spa", screenId: "" },
      { enabled: true, title: "Pool", subtitle: "Swim and relax", icon: "pool", screenId: "" },
    ],
  },
  restaurant: { enabled: true },
  whatsappButton: { enabled: true },
};
