/**
 * Prices and taxes (module 76) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/76-pricing-tax.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const pricingTaxModule: RecordModule = {
  key: "pricing-tax",
  /** Codes look like PT-0042. */
  prefix: "PT",
  noun: "rule",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "price_list",
        name: "Price list",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("applies", "Applies to", "text", { inList: true }),
          field("from", "From", "date", { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Draft", "Approved!", "Retired."),
      },
      {
        key: "tax",
        name: "Tax",
        active: true,
        fields: [
          field("name", "Tax", "text", { required: true, inList: true }),
          field("rate", "Rate (%)", "number", { required: true, inList: true }),
          field("applies", "Applies to", "text", { inList: true }),
          field("inclusive", "Included in prices", "yesno"),
        ],
        statuses: steps("Active!", "Retired."),
      },
      {
        key: "discount",
        name: "Discount rule",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("rate", "Discount (%)", "number", { required: true, inList: true }),
          field("who", "Who gets it", "text", { inList: true }),
          field("ends", "Ends", "date"),
        ],
        statuses: steps("Draft", "Approved!", "Ended."),
      },
    ],
  },
};
