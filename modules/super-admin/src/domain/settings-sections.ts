/**
 * The settings sections the super admin edits, their rules and defaults.
 * Colours here are brand token NAMES (from packages/design-tokens), never
 * raw hex, so the theme file stays the one source of colour.
 */

import { z } from "zod";

/** Hotel profile (spec: "Hotel settings"). */
const hotel = z.object({
  name: z.string().min(2).max(120),
  shortName: z.string().max(40),
  address: z.string().max(300),
  phone: z.string().max(40),
  /** The company WhatsApp number guests chat with (digits with the country code, such as 256793128137). */
  whatsapp: z.string().regex(/^\+?[0-9 ]{0,20}$/),
  email: z.string().max(120),
  tin: z.string().max(40),
  registration: z.string().max(80),
});

/** Branding shown on the login screen, receipts and the apps. */
const branding = z.object({
  /** Which logo lockup the apps show: `stacked` or `horizontal`. */
  logo: z.enum(["stacked", "horizontal"]),
  /** Global announcement banner across all apps ("" for none). */
  announcement: z.string().max(300),
  /** The login screen's welcome line. */
  loginWelcome: z.string().max(160),
  /** Lowest app version allowed; older apps are asked to update. */
  minimumAppVersion: z.string().max(20),
});

/**
 * One item of the content the super admin manages: a home banner, a curated finding or a trending experience.
 * `imageFileId` is a file id from the Files upload ("" for no picture);
 * `screen` is the app screen code the banner opens ("" for none).
 */
const contentItem = z.object({
  id: z.string().min(1).max(40),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(200),
  imageFileId: z.string().max(80),
  screen: z.string().max(20),
  active: z.boolean(),
});

/**
 * Content the apps show that the super admin changes without code:
 * the home carousel's banners, the search screen's curated findings and its trending experiences.
 * All three use the same item shape; the app shows only the active items, in the admin's order.
 */
const content = z.object({
  banners: z.array(contentItem).max(10),
  findings: z.array(contentItem).max(12),
  trending: z.array(contentItem).max(12),
});

/** Time, money and number formats. */
const regional = z.object({
  timeZone: z.string().max(60),
  currency: z.string().length(3),
  dateFormat: z.string().max(20),
  businessDayCutoff: z.string().regex(/^\d{2}:\d{2}$/),
  financialYearStartMonth: z.number().int().min(1).max(12),
});

export const SETTINGS_SECTIONS = { hotel, branding, content, regional } as const;
export type SettingsSection = keyof typeof SETTINGS_SECTIONS;
export const SECTION_NAMES = Object.keys(SETTINGS_SECTIONS) as SettingsSection[];

/** Starting values, used until the super admin saves a section. */
export const SETTINGS_DEFAULTS: { [K in SettingsSection]: z.infer<(typeof SETTINGS_SECTIONS)[K]> } = {
  hotel: { name: "Igongo Country Hotel & Cultural Centre", shortName: "Igongo", address: "Mbarara, Uganda", phone: "", whatsapp: "256793128137", email: "", tin: "", registration: "" },
  branding: { logo: "stacked", announcement: "", loginWelcome: "Welcome to Igongo", minimumAppVersion: "0.0.0" },
  content: { banners: [], findings: [], trending: [] },
  regional: { timeZone: "Africa/Kampala", currency: "UGX", dateFormat: "DD/MM/YYYY", businessDayCutoff: "04:00", financialYearStartMonth: 7 },
};

/** Sections anyone may read (the login screen needs them before sign-in). */
export const PUBLIC_SECTIONS: SettingsSection[] = ["hotel", "branding", "content"];
