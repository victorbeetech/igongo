// Calls to the sign-in routes (Better Auth under /api/auth) and the login
// method switches. Every method's button calls the API; the API decides
// whether the method is switched on for this person.

import { api } from "@/shared/api/apiClient";

/** A switched-on method, as the login screen shows it. */
export interface PublicMethod {
  method: string;
  label: string;
  platform: "all" | "app";
}

/** `GET /api/login-methods`: the switched-on methods. */
export const fetchLoginMethods = () => api<{ methods: PublicMethod[]; firstMethod: string; allowSelfRegistration: boolean }>("/api/login-methods");

/** Email and password sign-in. A `twoFactorRedirect` reply means a 2FA code is needed next. */
export const signInEmail = (email: string, password: string) =>
  api<{ twoFactorRedirect?: boolean }>("/api/auth/sign-in/email", { method: "POST", body: { email, password } });

/** Client self sign-up with email and password. */
export const signUpEmail = (name: string, email: string, password: string) => api("/api/auth/sign-up/email", { method: "POST", body: { name, email, password } });

/** Google or Apple: the API returns the provider's page; the browser goes there and comes back to [returnTo]. */
export async function signInSocial(provider: "google" | "apple", returnTo: string) {
  const { url } = await api<{ url: string }>("/api/auth/sign-in/social", { method: "POST", body: { provider, callbackURL: returnTo, errorCallbackURL: returnTo } });
  window.location.href = url;
}

/** Second step of 2FA: the code from the authenticator app. */
export const verifyTotp = (code: string) => api("/api/auth/two-factor/verify-totp", { method: "POST", body: { code } });

/** Signs out this device. */
export const signOut = () => api("/api/auth/sign-out", { method: "POST", body: {} });

/** `GET /api/setup/status`: is the first super admin still to be set up? */
export const fetchSetupStatus = () => api<{ needed: boolean }>("/api/setup/status");

/** `POST /api/setup/claim`: the owner claims the first super admin role. */
export const claimSetup = () => api("/api/setup/claim", { method: "POST" });
