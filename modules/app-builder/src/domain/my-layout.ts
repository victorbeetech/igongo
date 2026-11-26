/**
 * The layout one signed-in person gets (`GET /api/layout/me`), combined
 * from all their roles by resolve-layout.ts.
 */

export interface MyLayout {
  /** Module keys in menu order, or `["*"]` for everything (super admin). */
  menu: string[];
  /** Bottom bar screen IDs, at most five. */
  tabs: string[];
  /** Home tiles in order. */
  tiles: string[];
  /** True when the client view switch shows. */
  canSwitchToClient: boolean;
  /** True when client view orders are marked as tests. */
  markTestOrders: boolean;
}
