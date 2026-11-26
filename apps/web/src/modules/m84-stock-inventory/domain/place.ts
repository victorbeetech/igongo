// Where module 84 (Stock & Inventory) lives in the API: the ledger, and its
// paperwork desk (requisitions, purchasing, suppliers, recipes) on the
// shared record pages.

import type { RecordPlace } from "@/shared/records/types/recordPlace";

/** The ledger: stores, items, movements, counts and settings. */
export const STOCK_PATH = "/api/stock";

/** The paperwork desk, a records-kit module. */
export const DESK: RecordPlace = { path: "/api/stock/desk", module: "stock-inventory" };
