// The shapes of the guest home's settings (the "home" section the API stores), and
// the blank item each "Add" button creates. Keep in step with
// modules/super-admin/src/domain/home-content.ts.

/** The icon names the apps draw; the API refuses any other. */
export type HomeIcon = "star" | "sunny" | "pool" | "restaurant" | "terrain" | "music" | "bar" | "spa" | "hotel" | "museum" | "events" | "shop";

/** The icon names with the words the editor shows for each. */
export const HOME_ICON_OPTIONS: [HomeIcon, string][] = [
  ["star", "Star"],
  ["sunny", "Sun"],
  ["pool", "Pool"],
  ["restaurant", "Restaurant"],
  ["terrain", "Hills and hike"],
  ["music", "Music"],
  ["bar", "Bar"],
  ["spa", "Spa"],
  ["hotel", "Hotel"],
  ["museum", "Museum"],
  ["events", "Events"],
  ["shop", "Shop"],
];

/** One "Happening today" bubble. */
export interface HomeStory {
  enabled: boolean;
  title: string;
  subtitle: string;
  icon: HomeIcon;
  imageUrl: string;
}

/** One hero slide. */
export interface HomeHeroSlide {
  enabled: boolean;
  tag: string;
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

/** One quick action. An empty screen ID opens the coming-soon page. */
export interface HomeQuickAction {
  enabled: boolean;
  title: string;
  subtitle: string;
  icon: HomeIcon;
  screenId: string;
}

/** The whole guest home section. A type alias (not an interface) so it can be sent as the save body. */
export type HomeSettings = {
  stories: { enabled: boolean; items: HomeStory[] };
  hero: { enabled: boolean; slides: HomeHeroSlide[] };
  quickActions: { enabled: boolean; items: HomeQuickAction[] };
  restaurant: { enabled: boolean };
  whatsappButton: { enabled: boolean };
};

/** The most items the API keeps in each list. */
export const HOME_LIMITS = { stories: 12, slides: 6, quickActions: 6 } as const;

/** The blank item each Add button creates. */
export const NEW_STORY: HomeStory = { enabled: true, title: "", subtitle: "", icon: "star", imageUrl: "" };
export const NEW_SLIDE: HomeHeroSlide = { enabled: true, tag: "", eyebrow: "", title: "", description: "", price: "", imageUrl: "" };
export const NEW_ACTION: HomeQuickAction = { enabled: true, title: "", subtitle: "", icon: "star", screenId: "" };
