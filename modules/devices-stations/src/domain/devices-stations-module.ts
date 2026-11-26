/**
 * Devices (module 18) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/18-devices-stations.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const devicesStationsModule: RecordModule = {
  key: "devices-stations",
  /** Codes look like DV-0042. */
  prefix: "DV",
  noun: "device",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "device",
        name: "Device",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Phone", "Tablet", "Card reader", "Card printer", "Receipt printer", "Kiosk", "Scanner", "Other"], { required: true, inList: true }),
          field("serial", "Serial number", "text", { inList: true }),
          field("station", "Station", "text", { inList: true }),
          field("holder", "Kept by", "staff"),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("Active", "Repair", "Lost.", "Retired."),
      },
      {
        key: "station",
        name: "Station",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Gate", "Reception", "Canteen", "Buffet", "Pool", "Museum", "Event hall", "Kitchen", "Other"], { inList: true }),
          field("devices", "Devices", "text"),
        ],
        statuses: steps("Active", "Off."),
      },
      {
        key: "alert",
        name: "Device alert",
        active: true,
        fields: [
          field("device", "Device", "text", { required: true, inList: true }),
          field("problem", "Problem", "longtext", { required: true }),
        ],
        statuses: steps("Open", "In progress", "Done."),
      },
    ],
  },
};
