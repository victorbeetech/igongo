// Where module 80 (Accounting export) lives in the API, for the shared record pages.

import type { RecordPlace } from "@/shared/records/types/recordPlace";

export const PLACE: RecordPlace = { path: "/api/accounting", module: "accounting-export" };
