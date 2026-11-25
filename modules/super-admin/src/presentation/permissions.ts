/** Permission keys the Super Admin Console checks. */

export const CONSOLE_PERMISSIONS = {
  viewModules: "super-admin.modules.view",
  editModules: "super-admin.modules.edit",
  viewSettings: "super-admin.settings.view",
  editSettings: "super-admin.settings.edit",
  viewKeys: "super-admin.keys.view",
  editKeys: "super-admin.keys.edit",
  deleteKeys: "super-admin.keys.delete",
} as const;
