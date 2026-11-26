// Calls for sign-in security: 2-step set-up and check, recovery codes, the
// first password, linked sign-in methods, password reset, and the super
// admin's security overview, staff match and sign-in log.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import { ME_KEY } from "@/shared/session/useMe";

// --- 2-step (Better Auth's two-factor plugin) ---

/** Starts 2-step: returns the authenticator link (for the QR code) and the recovery codes. */
export const enableTwoStep = (password: string) => api<{ totpURI: string; backupCodes: string[] }>("/api/auth/two-factor/enable", { method: "POST", body: { password } });

/** Checks a 6-digit code: finishes turning 2-step on, or finishes a sign-in. */
export const verifyTwoStepCode = (code: string) => api("/api/auth/two-factor/verify-totp", { method: "POST", body: { code } });

/** Signs in with one recovery code instead (each works once). */
export const verifyRecoveryCode = (code: string) => api("/api/auth/two-factor/verify-backup-code", { method: "POST", body: { code } });

/** New recovery codes; the old ones stop working. */
export const newRecoveryCodes = (password: string) => api<{ backupCodes: string[] }>("/api/auth/two-factor/generate-backup-codes", { method: "POST", body: { password } });

// --- Passwords ---

/** Adds a first password to an account made with Google or Apple. */
export const useSetFirstPassword = () =>
  useApiMutation((newPassword: string) => api("/api/security/me/password", { method: "POST", body: { newPassword } }), { done: "Password saved", refresh: [ME_KEY] });

/** Emails a reset link that comes back to [redirectTo]. */
export const requestPasswordReset = (email: string, redirectTo: string) => api("/api/auth/request-password-reset", { method: "POST", body: { email, redirectTo } });

/** Sets a new password with the token from the reset link. */
export const resetPassword = (token: string, newPassword: string) => api("/api/auth/reset-password", { method: "POST", body: { token, newPassword } });

// --- Linked sign-in methods ---

/** Starts linking Google or Apple; the browser goes to the provider and comes back to [returnTo]. */
export async function linkProvider(provider: "google" | "apple", returnTo: string) {
  const { url } = await api<{ url: string }>("/api/auth/link-social", { method: "POST", body: { provider, callbackURL: returnTo, errorCallbackURL: returnTo } });
  window.location.href = url;
}

/** Removes a linked method (never the last one; the server refuses). */
export const useUnlinkProvider = () =>
  useApiMutation((providerId: string) => api("/api/auth/unlink-account", { method: "POST", body: { providerId } }), { done: "Sign-in method removed", refresh: [ME_KEY] });

/** The portal's own rules for this person: idle sign-out minutes and the password length. */
export const useMySecuritySettings = () =>
  useQuery({ queryKey: ["my-security-settings"], queryFn: () => api<{ webIdleMinutes: number; passwordMinLength: number }>("/api/security/me/settings"), staleTime: 10 * 60_000 });

// --- The super admin ---

/** The Security settings overview: super admins, warnings and the rules. */
export interface SecurityOverview {
  superAdmins: { id: string; name: string; email: string; twoFactorEnabled: boolean }[];
  warnings: string[];
  policy: Record<string, unknown>;
}

export const useSecurityOverview = () => useQuery({ queryKey: ["security-overview"], queryFn: () => api<SecurityOverview>("/api/security/overview") });

/** Saves some security rules at once. */
export const useSaveSecurityRules = () =>
  useApiMutation((body: Record<string, unknown>) => api("/api/login-methods/policy", { method: "PATCH", body }), { done: "Security settings saved", refresh: [["security-overview"], ["login-methods-admin"]] });

/** Makes a verified guest account staff, by their staff record. */
export const useStaffMatch = (userId: string) =>
  useApiMutation((body: { staffNumber: string; phone: string }) => api<{ staffId: string }>("/api/security/staff-match", { method: "POST", body: { userId, ...body } }), {
    done: "Matched: this account is now a staff account",
    refresh: [["accounts"]],
  });

/** One sign-in log line (an Audit Trail entry of Users & Login). */
export interface SignInEvent {
  id: string;
  occurredAt: string;
  action: string;
  actorName?: string;
  recordId?: string;
  summary: string;
  context?: { ip?: string; userAgent?: string };
}

export const useSignInLog = (action: string) =>
  useQuery({
    queryKey: ["sign-in-log", action],
    queryFn: () => api<{ items: SignInEvent[] }>(`/api/audit/entries?module=users-login&limit=100${action ? `&action=${encodeURIComponent(action)}` : ""}`),
  });
