/**
 * The Better Auth hooks that enforce the super admin's login rules on every
 * path, and record sign-ins in the Audit Trail:
 *
 * - before each request: a switched-off method is refused at once, and
 *   self sign-up is refused when the policy says so;
 * - before each new account: status `pending` when approval is needed;
 * - after each new account: the default client role, and an audit entry;
 * - before each new session: account status and per-role method check;
 * - after each new session, and after each failed sign-in: an audit entry.
 */

import { CLIENT_ROLE_KEY } from "@igongo/contracts/roles-permissions";
import type { LoginMethod } from "@igongo/contracts/users-login";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { BetterAuthOptions } from "better-auth";
import { checkSessionStart } from "../../application/use-cases/check-session-start";
import { methodOfRequest } from "../../domain/method-of-request";
import type { AuthDeps } from "./auth-deps";
import { asApiError } from "./to-api-error";

/** The parts of a Better Auth request context the hooks read. */
type HookContext = { path?: string; body?: unknown; params?: unknown; headers?: Headers | undefined } | null | undefined;

/** Which method a request uses, from its context. */
function methodOf(ctx: HookContext): LoginMethod | null {
  if (!ctx?.path) return null;
  const body = (ctx.body ?? {}) as { provider?: string };
  const params = (ctx.params ?? {}) as { id?: string };
  return methodOfRequest({ path: ctx.path, provider: body.provider, providerParam: params.id, channel: ctx.headers?.get("x-otp-channel") ?? undefined });
}

/** The `hooks` and `databaseHooks` options for Better Auth. */
export function loginGuardHooks(deps: AuthDeps): Pick<BetterAuthOptions, "hooks" | "databaseHooks"> {
  return {
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        const method = methodOf(ctx);
        if (!method) return;
        // A switched-off method is refused before it does anything (no code is sent).
        if (!(await deps.settings.method(method)).enabled) {
          throw new APIError("FORBIDDEN", { message: "This sign-in method is switched off.", code: "METHOD_DISABLED" });
        }
        if (ctx.path === "/sign-up/email" && !(await deps.settings.policy()).allowSelfRegistration) {
          throw new APIError("FORBIDDEN", { message: "New accounts are created by the hotel.", code: "SIGN_UP_DISABLED" });
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        // Record failed sign-ins (wrong password, wrong code) without the secret.
        const returned = ctx.context.returned;
        const method = methodOf(ctx);
        if (!method || !(returned instanceof APIError) || ctx.path.startsWith("/sign-up")) return;
        const who = String((ctx.body as { email?: string; phoneNumber?: string; userId?: string } | undefined)?.email ?? "").toLowerCase();
        await deps.audit.record({ actorId: null, action: "login.failed", module: "users-login", recordType: "login", recordId: who || method, summary: `Failed sign-in with ${method}: ${returned.message}` });
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Accounts made by an admin are staff and active; self-made ones follow the policy.
            if (user["kind"] === "staff") return;
            const policy = await deps.settings.policy();
            return { data: { ...user, kind: "client", status: policy.newAccountsNeedApproval ? "pending" : "active" } };
          },
          after: async (user) => {
            // Every new client gets the default client role (staff get theirs from the admin).
            if (user["kind"] !== "staff") await deps.access.assignByKey({ userId: user.id, roleKey: CLIENT_ROLE_KEY, assignedBy: null });
            await deps.audit.record({ actorId: user.id, actorName: user.name, action: "account.created", module: "users-login", recordType: "user", recordId: user.id, summary: `Account created for ${user.name}` });
          },
        },
        delete: {
          after: async (user) => {
            // A deleted account keeps its Audit Trail history but loses its roles.
            await deps.access.removeAllFor(user.id);
            await deps.audit.record({ actorId: user.id, action: "account.deleted", module: "users-login", recordType: "user", recordId: user.id, summary: `Account deleted for ${user.name}` });
          },
        },
      },
      session: {
        create: {
          before: async (session, ctx) => {
            // The one gate every sign-in passes, whatever the method.
            await asApiError(() => checkSessionStart(deps, session.userId, methodOf(ctx)));
          },
          after: async (session, ctx) => {
            await deps.audit.record({
              actorId: session.userId,
              action: "login.succeeded",
              module: "users-login",
              recordType: "user",
              recordId: session.userId,
              summary: `Signed in${methodOf(ctx) ? ` with ${methodOf(ctx)}` : ""}`,
              context: { ...(session.ipAddress ? { ip: session.ipAddress } : {}), ...(session.userAgent ? { userAgent: session.userAgent } : {}) },
            });
          },
        },
      },
    },
  };
}
