/** Permission keys Payments checks. The super admin gives them to roles. */

export const PAYMENT_PERMISSIONS = {
  /** Own: pay my bills and see my payments (guests). Wider: pay for others at a till. */
  pay: "payments.payments.create",
  /** Own: my payments. Wider: the payments list (S77-04). */
  view: "payments.payments.view",
  /** Record cash, bank, room charge and account payments (S77-08). */
  manual: "payments.manual.create",
  /** Refund a payment (S77-05). */
  refund: "payments.refunds.approve",
  /** The method switches (S77-06). */
  methods: "payments.methods.edit",
} as const;
