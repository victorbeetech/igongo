/** Permission keys Staff Meals checks. The super admin gives them to roles. */

export const MEAL_PERMISSIONS = {
  /** See your own meals (own) or everyone's served list (all/department). */
  view: "staff-meals.claims.view",
  /** Serve meals at the canteen (scope all or location). */
  serve: "staff-meals.claims.create",
  /** Change meal times. */
  rules: "staff-meals.rules.edit",
} as const;
