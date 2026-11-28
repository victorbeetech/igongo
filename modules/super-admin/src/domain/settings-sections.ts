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
  /** The reservations email address guests write to. */
  email: z.string().max(120),
  /** Opening hours shown on the Contact Us screen, such as "24/7" or "08:00 - 22:00". */
  hours: z.string().max(80),
  /** Switch: false hides the Contact Us details from the app and shows a "not available" notice. */
  contactUsOn: z.boolean(),
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

/** Time, money and number formats. */
const regional = z.object({
  timeZone: z.string().max(60),
  currency: z.string().length(3),
  dateFormat: z.string().max(20),
  businessDayCutoff: z.string().regex(/^\d{2}:\d{2}$/),
  financialYearStartMonth: z.number().int().min(1).max(12),
});

export const SETTINGS_SECTIONS = { hotel, branding, regional } as const;
export type SettingsSection = keyof typeof SETTINGS_SECTIONS;
export const SECTION_NAMES = Object.keys(SETTINGS_SECTIONS) as SettingsSection[];

/** Starting values, used until the super admin saves a section. */
export const SETTINGS_DEFAULTS: { [K in SettingsSection]: z.infer<(typeof SETTINGS_SECTIONS)[K]> } = {
  // Contact details start empty: nothing is shown to guests until the super admin sets them.
  hotel: { name: "Igongo Country Hotel & Cultural Centre", shortName: "Igongo", address: "", phone: "", whatsapp: "", email: "", hours: "", contactUsOn: true, tin: "", registration: "" },
  branding: { logo: "stacked", announcement: "", loginWelcome: "Welcome to Igongo", minimumAppVersion: "0.0.0" },
  regional: { timeZone: "Africa/Kampala", currency: "UGX", dateFormat: "DD/MM/YYYY", businessDayCutoff: "04:00", financialYearStartMonth: 7 },
};

/** Sections anyone may read (the login screen needs them before sign-in). */
export const PUBLIC_SECTIONS: SettingsSection[] = ["hotel", "branding"];
