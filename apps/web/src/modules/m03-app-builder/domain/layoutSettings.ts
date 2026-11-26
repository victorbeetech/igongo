// The app-wide layout rules (S03-06, S03-07).

export interface LayoutSettings {
  /** Module keys open before sign-in. */
  publicModules: string[];
  /** Role keys that may switch to the client view; `*` is every staff role. */
  clientViewRoles: string[];
  /** Orders made in the client view carry a TEST mark. */
  markTestOrders: boolean;
}
