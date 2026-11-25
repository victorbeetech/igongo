/**
 * Use cases for the login method switches: what the login screen shows, and
 * the super admin turning a method on or off or limiting it to some roles.
 */

import type { LoginMethod } from "@igongo/contracts/users-login";
import { recordChange, type ChangeContext } from "@igongo/core";
import { METHOD_INFO, type LoginMethodSetting, type MethodPlatform } from "../../domain/login-method-setting";
import type { LoginSettingsStore } from "../ports/login-settings-store";

/** A method as the login screen sees it. */
export interface PublicMethod {
  method: LoginMethod;
  label: string;
  platform: MethodPlatform;
}

/**
 * The switched-on methods, in order, for the login screen. Role limits are
 * not shown here (nobody is signed in yet); they are checked at sign-in.
 */
export async function publicMethods(store: LoginSettingsStore): Promise<{ methods: PublicMethod[]; firstMethod: string; allowSelfRegistration: boolean }> {
  const [methods, policy] = await Promise.all([store.methods(), store.policy()]);
  return {
    methods: methods
      .filter((m) => m.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({ method: m.method, label: METHOD_INFO[m.method].label, platform: METHOD_INFO[m.method].platform })),
    firstMethod: policy.firstMethod,
    allowSelfRegistration: policy.allowSelfRegistration,
  };
}

/** Saves one method's switch, role list or order, and records the change. */
export async function updateLoginMethod(store: LoginSettingsStore, ctx: ChangeContext, method: LoginMethod, patch: Partial<Omit<LoginMethodSetting, "method">>): Promise<LoginMethodSetting> {
  const before = await store.method(method);
  const after = { ...before, ...patch, method };
  await store.saveMethod(after, ctx.actorId);
  await recordChange(ctx, {
    action: before.enabled === after.enabled ? "login_method.updated" : after.enabled ? "login_method.enabled" : "login_method.disabled",
    module: "users-login",
    recordType: "login_method",
    recordId: method,
    summary: `${after.enabled ? "Turned on" : "Turned off"} ${METHOD_INFO[method].label}${after.allowedRoleKeys ? ` for ${after.allowedRoleKeys.length} roles` : ""}`,
    changes: { enabled: { old: before.enabled, new: after.enabled }, allowedRoleKeys: { old: before.allowedRoleKeys, new: after.allowedRoleKeys }, sortOrder: { old: before.sortOrder, new: after.sortOrder } },
  });
  return after;
}
