// The hand-made web pages of module 31 (Bonuses & Rewards), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { BuffetStationPage } from "./presentation/buffet/BuffetStationPage";
import { GiveRewardPage } from "./presentation/give/GiveRewardPage";
import { RewardsListPage } from "./presentation/list/RewardsListPage";
import { MyRewardsPage } from "./presentation/mine/MyRewardsPage";
import { RewardRulesPage } from "./presentation/rules/RewardRulesPage";

/** Module 31's hand-made web pages. */
export const m31Overrides: ScreenOverrides = {
  "S31-01": (s) => <MyRewardsPage screen={s} />,
  "S31-02": (s) => <GiveRewardPage screen={s} />,
  "S31-03": (s) => <RewardsListPage screen={s} />,
  "S31-04": (s) => <BuffetStationPage screen={s} />,
  "S31-05": (s) => <RewardRulesPage screen={s} />,
};
