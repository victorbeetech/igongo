// The hand-made web pages of module 84 (Stock & Inventory), live from the
// API: the ledger pages here, and the paperwork (requisitions, purchase
// requests and orders, suppliers, recipes) on the shared record pages.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { DESK } from "./domain/place";
import { CountPage } from "./presentation/CountPage";
import { ItemsPage } from "./presentation/ItemsPage";
import { MovementPage } from "./presentation/MovementPage";
import { StockHomePage } from "./presentation/StockHomePage";
import { StockSettingsPage } from "./presentation/StockSettingsPage";
import { StoresPage } from "./presentation/StoresPage";

/** Module 84's hand-made web pages. */
export const m84Overrides: ScreenOverrides = {
  "S84-01": (s) => <StockHomePage screen={s} />,
  "S84-19": (s) => <StockHomePage screen={s} />,
  "S84-02": (s) => <StoresPage screen={s} />,
  "S84-03": (s) => <ItemsPage screen={s} />,
  "S84-04": (s) => <ItemsPage screen={s} />,
  "S84-05": (s) => <ItemsPage screen={s} editor />,
  "S84-07": (s) => <MovementPage screen={s} kind="receive" />,
  "S84-10": (s) => <MovementPage screen={s} kind="issue" />,
  "S84-11": (s) => <MovementPage screen={s} kind="transfer" />,
  "S84-16": (s) => <MovementPage screen={s} kind="count" />,
  "S84-17": (s) => <MovementPage screen={s} kind="waste" />,
  "S84-15": (s) => <CountPage screen={s} />,
  "S84-06": (s) => <StockSettingsPage screen={s} />,
  "S84-20": (s) => <StockSettingsPage screen={s} desk />,
  ...recordOverrides(DESK, {
    "S84-08": ["list", { types: ["requisition"], staff: true }],
    "S84-09": ["form", { types: ["requisition"] }],
    "S84-12": ["list", { types: ["purchase_request"], staff: true }],
    "S84-13": ["list", { types: ["purchase_order"], staff: true }],
    "S84-14": ["list", { types: ["supplier"], staff: true }],
    "S84-18": ["list", { types: ["recipe"], staff: true }],
  }),
};
