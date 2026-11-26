// The hand-made web pages of module 16 (Staff Cards), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { CardDetailPage } from "./presentation/card-detail/CardDetailPage";
import { CardDesignerPage } from "./presentation/card-designer/CardDesignerPage";
import { CardTypesPage } from "./presentation/card-designer/CardTypesPage";
import { TemplateAssignmentPage } from "./presentation/card-designer/TemplateAssignmentPage";
import { CardsListPage } from "./presentation/cards-list/CardsListPage";
import { MyCardPage } from "./presentation/my-card/MyCardPage";
import { WhoOwnsCardPage } from "./presentation/who-owns/WhoOwnsCardPage";

/** Module 16's hand-made web pages. */
export const m16Overrides: ScreenOverrides = {
  "S16-01": (s) => <CardsListPage screen={s} />,
  "S16-02": (s) => <CardDesignerPage screen={s} />,
  "S16-03": (s) => <CardDesignerPage screen={s} />,
  "S16-04": (s) => <CardDesignerPage screen={s} />,
  "S16-05": (s) => <TemplateAssignmentPage screen={s} />,
  "S16-06": (s) => <CardTypesPage screen={s} />,
  "S16-07": (s) => <CardTypesPage screen={s} />,
  "S16-08": (s) => <CardsListPage screen={s} />,
  "S16-09": (s) => <CardDetailPage screen={s} />,
  "S16-15": (s) => <WhoOwnsCardPage screen={s} />,
  "S16-19": (s) => <MyCardPage screen={s} />,
};
