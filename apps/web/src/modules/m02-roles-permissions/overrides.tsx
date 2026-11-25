// The hand-made web pages of module 02, connected to the live API. Every
// other page of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { PermissionReportPage } from "./presentation/permission-report/PermissionReportPage";
import { PermissionsMatrixPage } from "./presentation/permissions-matrix/PermissionsMatrixPage";
import { RoleBuilderPage } from "./presentation/role-builder/RoleBuilderPage";
import { RoleHoldersPage } from "./presentation/role-holders/RoleHoldersPage";
import { RolesListPage } from "./presentation/roles-list/RolesListPage";

/** Module 02's hand-made web pages. */
export const m02Overrides: ScreenOverrides = {
  "S02-01": (s) => <RolesListPage screen={s} />,
  "S02-02": (s) => <RoleBuilderPage screen={s} />,
  "S02-03": (s) => <PermissionsMatrixPage screen={s} />,
  "S02-07": (s) => <RoleHoldersPage screen={s} />,
  "S02-11": (s) => <PermissionReportPage screen={s} />,
};
