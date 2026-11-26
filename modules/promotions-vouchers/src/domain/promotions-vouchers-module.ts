/**
 * Promotions and vouchers (module 59) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/59-promotions-vouchers.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const promotionsVouchersModule: RecordModule = {
  key: "promotions-vouchers",
  /** Codes look like PV-0042. */
  prefix: "PV",
  noun: "voucher",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "promotion",
        name: "Promotion",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("code", "Promo code", "text", { inList: true }),
          field("discount", "Discount (%)", "number", { inList: true }),
          field("where", "Where it works", "text"),
          field("ends", "Ends", "date"),
        ],
        statuses: steps("Draft", "Live!", "Ended."),
      },
      {
        key: "voucher",
        name: "Voucher or gift card",
        active: true,
      selfService: true,
        fields: [
          field("holder", "For", "text", { required: true, inList: true }),
          field("value", "Value (UGX)", "money", { required: true, inList: true }),
          field("expires", "Expires", "date", { inList: true }),
          field("buyer_phone", "Buyer phone", "phone"),
        ],
        // A voucher is money: a request (a guest buying a gift card) only works
        // at checkout once an approver has moved it to Issued.
        statuses: steps("Requested", "Issued!", "Redeemed.", "Expired.", "Cancelled."),
      },
    ],
  },
};
