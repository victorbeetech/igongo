// The hand-made web pages of module 22 (HR Records), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { AddStaffPage } from "./presentation/add-staff/AddStaffPage";
import { StaffDirectoryPage } from "./presentation/staff-directory/StaffDirectoryPage";
import { MyProfilePage, StaffProfilePage } from "./presentation/staff-profile/StaffProfilePage";

/** Module 22's hand-made web pages. */
export const m22Overrides: ScreenOverrides = {
  "S22-01": (s) => <StaffDirectoryPage screen={s} />,
  "S22-02": (s) => <StaffProfilePage screen={s} />,
  "S22-03": (s) => <AddStaffPage screen={s} />,
  "S22-08": (s) => <MyProfilePage screen={s} />,
};
