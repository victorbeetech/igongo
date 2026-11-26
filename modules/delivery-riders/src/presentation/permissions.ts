/** Permission keys Delivery & Riders checks. The super admin gives them to roles. */

export const DELIVERY_PERMISSIONS = {
  /** Scope `assigned`: a rider's own jobs. Scope `all`: the dispatch board. */
  view: "delivery-riders.jobs.view",
  /** Scope `assigned`: work my jobs (rider). Scope `all`: assign jobs, receive cash (dispatcher). */
  edit: "delivery-riders.jobs.edit",
  /** Zones, fees, assignment, proof and cash rules. */
  rules: "delivery-riders.rules.edit",
} as const;
