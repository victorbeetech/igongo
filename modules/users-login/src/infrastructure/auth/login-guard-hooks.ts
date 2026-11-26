/**
 * The Better Auth hooks that enforce the super admin's login and security
 * rules on every path, and record sign-ins in the Audit Trail:
 *
 * - before each request: emails and names are tidied, a switched-off method
 *   is refused at once, self sign-up is refused when the policy says so,
 *   weak passwords are refused, a locked email is refused, and linking a
 *   new sign-in method needs a fresh sign-in;
 * - after each request: wrong passwords are counted (lockout), failed
 *   sign-ins and unlinked methods are recorded;
 * - before each new account: never on the web portal (guests sign up in the
 *   app), and `pending` when approval is needed;
 * - after each new account: the default guest role, and an audit entry;
 * - before a linked method: Google or Apple must give the same email, except
 *   Apple "Hide My Email" relay addresses linked from inside the account;
 * - after a linked method: an audit entry and an email to the person;
 * - before each new session: account status, staff-only web, per-role
 *   method check, and no skipping 2-step;
 * - after each new session: an audit entry, the lockout count cleared and
 *   the new-device alert.
 */

import { CLIENT_ROLE_KEY } from "@igongo/contracts/roles-permissions";
import type { LoginMethod } from "@igongo/contracts/users-login";
import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import type { BetterAuthOptions } from "better-auth";
import { checkSessionStart } from "../../application/use-cases/check-session-start";
import { isOwnerSettingUp } from "../../application/use-cases/claim-first-super-admin";
import { countFailure, refuseIfLocked } from "../../application/use-cases/login-lockout";
import { noteSignInDevice } from "../../application/use-cases/note-sign-in-device";
import { isAppleRelay, normalizeEmail, tidyName } from "../../domain/email-address";
import { methodOfRequest } from "../../domain/method-of-request";
import { passwordProblem } from "../../domain/password-rules";
import { surfaceOf } from "../../domain/request-surface";
import type { AuthDeps } from "./auth-deps";
import { asApiError } from "./to-api-error";

/** The parts of a Better Auth request context the hooks read. */
type HookContext = { path?: string; body?: unknown; params?: unknown; headers?: Headers | undefined } | null | undefined;

/** Minutes a sign-in counts as "fresh" for adding or removing a sign-in method. */
export const FRESH_SIGN_IN_SECONDS = 10 * 60;

/** Paths whose body carries a new password, and the field it is in. */
const NEW_PASSWORD_FIELD: Record<string, string> = { "/sign-up/email": "password", "/reset-password": "newPassword", "/change-password": "newPassword" };

/** Which method a request uses, from its context. */
function methodOf(ctx: HookContext): LoginMethod | null {
  if (!ctx?.path) return null;
  const body = (ctx.body ?? {}) as { provider?: string };
  const params = (ctx.params ?? {}) as { id?: string };
  return methodOfRequest({ path: ctx.path, provider: body.provider, providerParam: params.id, channel: ctx.headers?.get("x-otp-channel") ?? undefined });
}

/** The email inside a Google or Apple ID token (already checked by Better Auth), or null. */
function emailInIdToken(idToken: string | null | undefined): string | null {
  const payload = idToken?.split(".")[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { email?: unknown };
    return typeof claims.email === "string" ? claims.email : null;
  } catch {
    // Not a readable token: treat as "no email", so the link is refused below.
    return null;
  }
}

/** The `hooks` and `databaseHooks` options for Better Auth. [webOrigins] are the staff portal's addresses. */
export function loginGuardHooks(deps: AuthDeps, webOrigins: string[]): Pick<BetterAuthOptions, "hooks" | "databaseHooks"> {
  const surface = (ctx: HookContext) => surfaceOf(ctx?.headers ?? undefined, webOrigins, ctx?.path);

  return {
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // 1. Tidy the email and name the same way everywhere.
        const body = ctx.body as Record<string, unknown> | undefined;
        const tidied =
          body && (typeof body["email"] === "string" || typeof body["name"] === "string")
            ? {
                ...body,
                ...(typeof body["email"] === "string" ? { email: normalizeEmail(body["email"]) } : {}),
                ...(typeof body["name"] === "string" ? { name: tidyName(body["name"]) } : {}),
              }
            : null;
        // 2. A switched-off method is refused before it does anything (no code is sent).
        const method = methodOf(ctx);
        if (method && !(await deps.settings.method(method)).enabled) {
          throw new APIError("FORBIDDEN", { message: "This sign-in method is switched off.", code: "METHOD_DISABLED" });
        }
        const policy = await deps.settings.policy();
        if (ctx.path === "/sign-up/email" && !policy.allowSelfRegistration) {
          throw new APIError("FORBIDDEN", { message: "New accounts are created by the hotel.", code: "SIGN_UP_DISABLED" });
        }
        // 3. The password rules, for every new password.
        const field = NEW_PASSWORD_FIELD[ctx.path];
        const newPassword = field ? body?.[field] : undefined;
        const problem = typeof newPassword === "string" ? passwordProblem(newPassword, policy) : null;
        if (problem) throw new APIError("BAD_REQUEST", { message: problem, code: "WEAK_PASSWORD" });
        // 4. A locked email cannot even try.
        if (ctx.path === "/sign-in/email" && typeof tidied?.["email"] === "string") await asApiError(() => refuseIfLocked(deps.failedLogins, tidied["email"] as string, new Date()));
        // 5. Linking Google or Apple to an account needs a recent sign-in.
        if (ctx.path === "/link-social") {
          const session = await getSessionFromCtx(ctx);
          if (!session) throw new APIError("UNAUTHORIZED", { message: "Sign in first.", code: "SIGN_IN_REQUIRED" });
          if (Date.now() - new Date(session.session.createdAt).getTime() > FRESH_SIGN_IN_SECONDS * 1000) {
            throw new APIError("FORBIDDEN", { message: "For your safety, sign in again before adding a sign-in method.", code: "SESSION_NOT_FRESH" });
          }
        }
        if (tidied) return { context: { body: tidied } };
      }),
      after: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned;
        const failed = returned instanceof APIError;
        // A removed sign-in method: record it and tell the person.
        if (ctx.path === "/unlink-account" && !failed && ctx.context.session) {
          const { user } = ctx.context.session;
          const provider = String((ctx.body as { providerId?: string } | undefined)?.providerId ?? "a method");
          await deps.audit.record({ actorId: user.id, actorName: user.name, action: "login_method.unlinked", module: "users-login", recordType: "user", recordId: user.id, summary: `Removed the sign-in method ${provider}` });
          await deps.alerts.toPerson({ userId: user.id, email: user.email }, `The sign-in method ${provider} was removed from your Igongo account. If this was not you, contact the hotel.`);
        }
        // Record failed sign-ins (wrong password, wrong code) without the secret.
        const method = methodOf(ctx);
        if (!method || !failed || ctx.path.startsWith("/sign-up")) return;
        const who = normalizeEmail(String((ctx.body as { email?: string } | undefined)?.email ?? ""));
        await deps.audit.record({ actorId: null, action: "login.failed", module: "users-login", recordType: "login", recordId: who || method, summary: `Failed sign-in with ${method}: ${returned.message}` });
        // Wrong passwords count towards the lockout (a refusal because of the lock does not).
        if (ctx.path === "/sign-in/email" && who && returned.status !== "TOO_MANY_REQUESTS") {
          if (await countFailure(deps.failedLogins, await deps.settings.policy(), who, new Date())) {
            await deps.audit.record({ actorId: null, action: "login.locked_out", module: "users-login", recordType: "login", recordId: who, summary: "Locked after too many wrong passwords" });
          }
        }
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            // Accounts made by an admin are staff and active.
            if (user["kind"] === "staff") return;
            // Guests sign up in the app, never on the staff web portal (the owner once, for the set-up).
            if (surface(ctx) === "web" && !(await isOwnerSettingUp(deps, user.email))) {
              throw new APIError("FORBIDDEN", { message: "Create your account in the Igongo app. The web portal is for hotel staff.", code: "STAFF_ONLY" });
            }
            // Self-made accounts are always guests: nobody can sign up as staff or pick a role.
            const policy = await deps.settings.policy();
            return { data: { ...user, name: tidyName(user.name), kind: "client", status: policy.newAccountsNeedApproval ? "pending" : "active" } };
          },
          after: async (user) => {
            // Every new guest gets the default guest role (staff get theirs from the super admin).
            if (user["kind"] !== "staff") await deps.access.assignByKey({ userId: user.id, roleKey: CLIENT_ROLE_KEY, assignedBy: null });
            await deps.audit.record({ actorId: user.id, actorName: user.name, action: "account.created", module: "users-login", recordType: "user", recordId: user.id, summary: `Account created for ${user.name}` });
          },
        },
        delete: {
          before: async (user) => {
            // Staff accounts hold HR and payroll history: HR closes them, not a button.
            if (user["kind"] === "staff") throw new APIError("FORBIDDEN", { message: "Staff accounts are closed by HR. Please contact HR.", code: "STAFF_ACCOUNT" });
          },
          after: async (user) => {
            // A deleted account keeps its Audit Trail history but loses its roles.
            await deps.access.removeAllFor(user.id);
            await deps.audit.record({ actorId: user.id, action: "account.deleted", module: "users-login", recordType: "user", recordId: user.id, summary: `Account deleted for ${user.name}` });
          },
        },
      },
      account: {
        create: {
          before: async (account) => {
            // Only Google and Apple links need the email check.
            if (account.providerId !== "google" && account.providerId !== "apple") return;
            const owner = await deps.accounts.get(account.userId);
            // A brand-new account: the provider's email is the account's email.
            if (!owner || owner.providers.length === 0) return;
            const providerEmail = emailInIdToken(account.idToken);
            if (providerEmail && (normalizeEmail(providerEmail) === owner.email || isAppleRelay(providerEmail))) return;
            throw new APIError("FORBIDDEN", { message: "This Google or Apple account uses a different email, so it cannot be linked.", code: "EMAIL_DOES_NOT_MATCH" });
          },
          after: async (account) => {
            const owner = await deps.accounts.get(account.userId);
            // Only a method added to an existing account is a "link".
            if (!owner || owner.providers.length < 2) return;
            await deps.audit.record({ actorId: owner.id, actorName: owner.name, action: "login_method.linked", module: "users-login", recordType: "user", recordId: owner.id, summary: `Linked the sign-in method ${account.providerId}` });
            await deps.alerts.toPerson({ userId: owner.id, email: owner.email }, `${account.providerId} was linked to your Igongo account. If this was not you, contact the hotel.`);
          },
        },
      },
      session: {
        create: {
          before: async (session, ctx) => {
            // The one gate every sign-in passes, whatever the method.
            await asApiError(() => checkSessionStart(deps, session.userId, methodOf(ctx), surface(ctx)));
          },
          after: async (session, ctx) => {
            const method = methodOf(ctx);
            await deps.audit.record({
              actorId: session.userId,
              action: "login.succeeded",
              module: "users-login",
              recordType: "user",
              recordId: session.userId,
              summary: `Signed in${method ? ` with ${method}` : ""}`,
              context: { ...(session.ipAddress ? { ip: session.ipAddress } : {}), ...(session.userAgent ? { userAgent: session.userAgent } : {}) },
            });
            const person = await deps.accounts.get(session.userId);
            if (!person) return;
            // A good sign-in starts the wrong-password count again.
            await deps.failedLogins.clear(person.email);
            await noteSignInDevice(deps, { userId: person.id, email: person.email, name: person.name, isStaff: person.kind === "staff" }, { userAgent: session.userAgent, ip: session.ipAddress }, (await deps.settings.policy()).newDeviceAlerts);
          },
        },
      },
    },
  };
}
