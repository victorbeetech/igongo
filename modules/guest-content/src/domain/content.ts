/**
 * The guest app's editable content, as one document. The super admin edits it;
 * the guest app reads the active items, in their sort order.
 *
 * Every picture is a URL the super admin pastes (uploaded or hosted), so no
 * photo is baked into the app. Every list starts empty: nothing is demo data.
 */

/** One item of a content list: its id, whether it shows, and where it sits. */
export interface ContentItemBase {
  /** Stable id, made by the admin screen. */
  id: string;
  /** Shown in the guest app only when true. */
  active: boolean;
  /** Lower numbers show first. */
  sortOrder: number;
}

/** A banner shown on the home promotions slot and on other screens that have one. */
export interface Banner extends ContentItemBase {
  title: string;
  subtitle: string | null;
  /** Picture URL, or null for the themed placeholder. */
  imageUrl: string | null;
  /** Where a tap goes: an in-app route such as "/food", or an https link. Null means no tap. */
  linkTarget: string | null;
}

/** A round "story" bubble in the home row of events and highlights. */
export interface Story extends ContentItemBase {
  label: string;
  /** Picture URL, or null for the icon. */
  imageUrl: string | null;
  /** Material icon name the bubble shows when there is no picture (e.g. "pool"). */
  iconName: string | null;
  linkTarget: string | null;
}

/** A featured stay shown on the home hero carousel. */
export interface FeaturedStay extends ContentItemBase {
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  /** Shown as text only; prices come from the room and booking APIs, never typed here. */
  linkTarget: string | null;
}

/** A "did you know" card: a short fact about the hotel. */
export interface DidYouKnow extends ContentItemBase {
  title: string;
  body: string;
}

/** A slide on a restaurant or outlet carousel. */
export interface RestaurantSlide extends ContentItemBase {
  outletName: string;
  caption: string | null;
  imageUrl: string | null;
  linkTarget: string | null;
}

/** Editable words the guest home shows. Empty means the app shows its built-in wording. */
export interface GuestTexts {
  /** The line before the guest's first name, e.g. "Good morning". Empty uses the time-of-day greeting. */
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  /** The line shown when no guest is signed in, e.g. "Welcome to Igongo". */
  welcomeLine: string;
}

/** The whole guest content document. Every list is empty until the super admin adds items. */
export interface GuestContent {
  texts: GuestTexts;
  banners: Banner[];
  stories: Story[];
  featuredStays: FeaturedStay[];
  didYouKnow: DidYouKnow[];
  restaurantSlides: RestaurantSlide[];
}

/** Empty wording: the app keeps its built-in words until the super admin types new ones. */
export const EMPTY_GUEST_TEXTS: GuestTexts = { greetingMorning: "", greetingAfternoon: "", greetingEvening: "", welcomeLine: "" };

/** An empty document: what a new install shows before the super admin adds anything. */
export const EMPTY_GUEST_CONTENT: GuestContent = {
  texts: EMPTY_GUEST_TEXTS,
  banners: [],
  stories: [],
  featuredStays: [],
  didYouKnow: [],
  restaurantSlides: [],
};

/** The list keys of the document, so generic code can loop over them. */
export const CONTENT_LISTS = ["banners", "stories", "featuredStays", "didYouKnow", "restaurantSlides"] as const;
export type ContentListKey = (typeof CONTENT_LISTS)[number];
