/**
 * Use cases for the login method switches: what the login screen shows, and
 * the super admin turning a method on or off or limiting it to some roles.
 */

import type { LoginMethod } from "@igongo/contracts/users-login";
import { recordChange, type ChangeContext } from "@igongo/core";
import { METHOD_INFO, isProviderReady, type LoginMethodSetting, type MethodPlatform, type ProviderReadiness } from "../../domain/login-method-setting";
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
 *
 * A social method (Google, Apple) is listed only when its keys are set up on
 * the server: [providerReady] says which ones are. A switched-on method with no
 * keys is left out, so the login screen never shows a button that cannot work.
 */
export async function publicMethods(
  store: LoginSettingsStore,
  providerReady: ProviderReadiness = { google: true, apple: true },
): Promise<{ methods: PublicMethod[]; firstMethod: string; allowSelfRegistration: boolean; allowSelfDelete: boolean; allowSignOut: boolean }> {
  const [methods, policy] = await Promise.all([store.methods(), store.policy()]);
  return {
    methods: methods
      .filter((m) => m.enabled && isProviderReady(m.method, providerReady))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({ method: m.method, label: METHOD_INFO[m.method].label, platform: METHOD_INFO[m.method].platform })),
    firstMethod: policy.firstMethod,
    allowSelfRegistration: policy.allowSelfRegistration,
    // The app reads these two switches to show or hide Sign Out and Delete Account.
    allowSelfDelete: policy.allowSelfDelete,
    allowSignOut: policy.allowSignOut,
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
