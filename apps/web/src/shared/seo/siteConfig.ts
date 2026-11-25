// The facts every page's meta tags and structured data share. Change the
// hotel's name or address here and every page follows.

/** The public site's details for SEO. The address comes from the environment so each environment can differ. */
export const SITE = {
  /** The full name, as on the logo. */
  name: "Igongo Country Hotel & Cultural Centre",
  /** The short name, for titles and the app. */
  shortName: "Igongo",
  /** The public address of the site; set NEXT_PUBLIC_SITE_URL per environment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://igongo.co.ug",
  /** The default description for search results and sharing. */
  description: "Hotel, cultural museum, dining, events, pool and spa at Biharwe, Mbarara, Uganda. Book rooms, tours and tables, and order food online.",
  /** The sharing image from the brand kit (1200 by 630). */
  ogImage: "/brand/web/og-image.png",
  /** Where the hotel is. */
  locality: "Mbarara",
  region: "Western Region",
  country: "UG",
  street: "Biharwe",
  /** The number of rooms, from the hotel's own figures. */
  rooms: 52,
};
