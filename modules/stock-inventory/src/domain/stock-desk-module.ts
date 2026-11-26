/**
 * Stock's paperwork as a records-kit desk, mounted at `/api/stock/desk`:
 * requisitions, purchase requests, purchase orders, suppliers, stock
 * counts and recipes. The super admin changes their fields and approval
 * steps on the settings screen (no code). The stock itself moves only
 * through the ledger (`/api/stock/movements`), quoting these codes.
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const stockDeskModule: RecordModule = {
  key: "stock-inventory",
  /** Codes look like SD-0042. */
  prefix: "SD",
  noun: "stock paper",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "requisition",
        name: "Requisition",
        active: true,
        selfService: true,
        fields: [
          field("store", "From store", "text", { required: true, inList: true }),
          field("items", "Items and quantities", "longtext", { required: true }),
          field("needed_by", "Needed by", "date", { inList: true }),
          field("department", "For department", "text", { inList: true }),
        ],
        statuses: steps("Requested", "Approved!", "Issued.", "Part issued", "Rejected."),
      },
      {
        key: "purchase_request",
        name: "Purchase request",
        active: true,
        fields: [
          field("items", "Items and quantities", "longtext", { required: true }),
          field("estimate", "Estimated cost (UGX)", "money", { inList: true }),
          field("reason", "Why", "text"),
        ],
        statuses: steps("Requested", "Approved!", "Ordered.", "Rejected."),
      },
      {
        key: "purchase_order",
        name: "Purchase order",
        active: true,
        fields: [
          field("supplier", "Supplier", "text", { required: true, inList: true }),
          field("items", "Items, quantities and prices", "longtext", { required: true }),
          field("total", "Total (UGX)", "money", { required: true, inList: true }),
          field("expected", "Expected delivery", "date", { inList: true }),
        ],
        statuses: steps("Draft", "Approved!", "Sent", "Part received", "Received.", "Cancelled."),
      },
      {
        key: "supplier",
        name: "Supplier",
        active: true,
        fields: [
          field("name", "Supplier", "text", { required: true, inList: true }),
          field("phone", "Phone", "phone", { inList: true }),
          field("email", "Email", "text"),
          field("supplies", "What they supply", "text", { inList: true }),
          field("lead_days", "Lead time (days)", "number"),
          field("tin", "TIN", "text"),
        ],
        statuses: steps("Active", "On hold", "Stopped."),
      },
      {
        key: "count",
        name: "Stock count",
        active: true,
        fields: [
          field("store", "Store", "text", { required: true, inList: true }),
          choice("scope", "What is counted", ["Full count", "One category", "Spot check"], { inList: true }),
          choice("blind", "Blind count", ["Yes", "No"]),
          field("variances", "Variances found", "longtext"),
        ],
        statuses: steps("Planned", "Counting", "Variances approved!", "Closed."),
      },
      {
        key: "recipe",
        name: "Recipe",
        active: true,
        fields: [
          field("dish", "Menu item", "text", { required: true, inList: true }),
          field("ingredients", "Ingredients per portion", "longtext", { required: true }),
          field("portion_cost", "Cost per portion (UGX)", "money", { inList: true }),
        ],
        statuses: steps("Draft", "Approved!", "Retired."),
      },
    ],
  },
};
