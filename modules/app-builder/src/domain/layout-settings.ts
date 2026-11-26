/**
 * Layout rules for the whole app (S03-06, S03-07): which modules guests see
 * before signing in, which roles may switch to the client view, and whether
 * orders made in the client view are marked as tests.
 */

export interface LayoutSettings {
  /** Module keys open before sign-in, such as `room-bookings`. */
  publicModules: string[];
  /** Role keys that may switch to the client view; `*` means every staff role. */
  clientViewRoles: string[];
  /** Orders and bookings made in the client view carry a TEST mark. */
  markTestOrders: boolean;
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  publicModules: ["room-bookings", "museum", "events-conferences", "pool", "spa", "crafts-bookshop", "menu-catalogue", "public-website"],
  clientViewRoles: ["*"],
  markTestOrders: true,
};
