/**
 * Permission keys Stock & Inventory checks. Pre-made roles hold them with a
 * data scope that decides which stores they reach (see store-reach.ts):
 * store keepers their own stores, chefs their department's, procurement and
 * finance all of them.
 */

export const STOCK_PERMISSIONS = {
  /** Items, balances and the ledger. */
  view: "stock-inventory.stock.view",
  /** Prices, average costs and stock value (others see quantities only). */
  values: "stock-inventory.values.view",
  /** Receive, issue and transfer. */
  move: "stock-inventory.movements.create",
  /** Adjustments, waste and count corrections. */
  adjust: "stock-inventory.movements.edit",
  /** Approvers may also post adjustments. */
  approve: "stock-inventory.movements.approve",
  /** Add and change items and stores. */
  items: "stock-inventory.items.edit",
  export: "stock-inventory.stock.export",
  settings: "stock-inventory.settings.edit",
} as const;
