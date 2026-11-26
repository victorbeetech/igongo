/**
 * Fleet and transport (module 47) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/47-fleet-transport.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const fleetTransportModule: RecordModule = {
  key: "fleet-transport",
  /** Codes look like FL-0042. */
  prefix: "FL",
  noun: "trip",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "vehicle",
        name: "Vehicle",
        active: true,
        fields: [
          field("plate", "Plate", "text", { required: true, inList: true }),
          field("model", "Model", "text", { inList: true }),
          field("seats", "Seats", "number"),
          field("driver", "Usual driver", "staff"),
          field("insurance", "Insurance ends", "date"),
        ],
        statuses: steps("Available", "On a trip", "In repair", "Retired."),
      },
      {
        key: "trip",
        name: "Trip or transfer",
        active: true,
      selfService: true,
        fields: [
          field("from", "From", "text", { required: true, inList: true }),
          field("to", "To", "text", { required: true, inList: true }),
          field("when", "Date", "date", { inList: true }),
          field("time", "Time", "time", { inList: true }),
          field("people", "People", "number"),
          field("vehicle", "Vehicle", "text"),
          field("driver", "Driver", "staff"),
          field("price", "Price (UGX)", "money"),
        ],
        statuses: steps("Requested", "Approved!", "On the way", "Done.", "Cancelled."),
      },
      {
        key: "fuel",
        name: "Fuel or repair",
        active: true,
        fields: [
          field("vehicle", "Vehicle", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Fuel", "Service", "Repair", "Tyres"], { inList: true }),
          field("amount", "Amount (UGX)", "money", { required: true, inList: true }),
          field("km", "Odometer (km)", "number"),
          field("receipt", "Receipt", "photo"),
        ],
        statuses: steps("Submitted", "Approved!", "Paid."),
      },
    ],
  },
};
