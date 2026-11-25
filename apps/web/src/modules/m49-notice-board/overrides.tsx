// The hand-made web pages of module 49 (Notice Board), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { BoardPage } from "./presentation/board/BoardPage";
import { BoardSettingsPage, NewPostPage } from "./presentation/new-post/NewPostPage";
import { PostDetailPage } from "./presentation/post-detail/PostDetailPage";

/** Module 49's hand-made web pages. */
export const m49Overrides: ScreenOverrides = {
  "S49-01": (s) => <BoardPage screen={s} />,
  "S49-02": (s) => <PostDetailPage screen={s} />,
  "S49-03": (s) => <NewPostPage screen={s} />,
  "S49-05": (s) => <BoardSettingsPage screen={s} />,
};
