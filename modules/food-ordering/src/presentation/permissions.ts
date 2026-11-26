/** Permission keys Food Ordering checks. The super admin gives them to roles. */

export const ORDER_PERMISSIONS = {
  /** Own: order for myself (guests). Wider: take orders for others (waiters, phone orders). */
  create: "food-ordering.orders.create",
  /** Own: my orders. Wider: the orders board (S62-12). */
  view: "food-ordering.orders.view",
  /** Move orders on and cancel them (front of house). */
  edit: "food-ordering.orders.edit",
  /** Kitchen display staff may move orders too. */
  kitchen: "kitchen-display.tickets.edit",
  kitchenView: "kitchen-display.tickets.view",
  /** The ordering rules (S62-16). */
  rules: "food-ordering.rules.edit",
} as const;
