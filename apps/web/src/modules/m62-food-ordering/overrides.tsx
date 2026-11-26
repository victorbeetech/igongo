// The hand-made web pages of module 62 (Food Ordering), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { MyOrdersPage } from "./presentation/my-orders/MyOrdersPage";
import { OrderFoodPage } from "./presentation/order-food/OrderFoodPage";
import { OrderingSettingsPage } from "./presentation/ordering-settings/OrderingSettingsPage";
import { OrdersBoardPage } from "./presentation/orders-board/OrdersBoardPage";

/** The ordering flow: every step lives on one page on the web. */
const order = (s: Parameters<ScreenOverrides[string]>[0]) => <OrderFoodPage screen={s} />;

/** Module 62's hand-made web pages. */
export const m62Overrides: ScreenOverrides = {
  "S62-01": order, "S62-02": order, "S62-03": order, "S62-04": order, "S62-05": order, "S62-06": order, "S62-07": order, "S62-08": order,
  "S62-09": (s) => <MyOrdersPage screen={s} />,
  "S62-10": (s) => <MyOrdersPage screen={s} />,
  "S62-11": (s) => <MyOrdersPage screen={s} />,
  "S62-12": (s) => <OrdersBoardPage screen={s} />,
  "S62-13": (s) => <OrdersBoardPage screen={s} />,
  "S62-16": (s) => <OrderingSettingsPage screen={s} />,
};
