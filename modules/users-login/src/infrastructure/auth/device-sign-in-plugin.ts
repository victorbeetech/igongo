/**
 * A Better Auth plugin for the sign-in methods Better Auth does not have:
 *
 *   POST /api/auth/pin/set            set a PIN for this device (signed in)
 *   POST /api/auth/pin/sign-in        sign in on a trusted device with the PIN
 *   POST /api/auth/card/sign-in/nfc   sign in by tapping a staff card (kiosk)
 *   POST /api/auth/card/sign-in/qr    sign in by scanning a staff card QR code
 *
 * Each one ends by creating a normal Better Auth session, so the same
 * session hook checks the method switches and the account status.
 */

import type { BetterAuthPlugin, GenericEndpointContext } from "better-auth";
import { createAuthEndpoint, sessionMiddleware, APIError } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import type { CardDirectory } from "../../application/ports/card-directory";
import type { PinStore } from "../../application/ports/pin-store";
import { setPin, verifyPin } from "../../application/use-cases/pin-sign-in";
import { asApiError } from "./to-api-error";

const deviceId = z.string().min(8).max(200);

/** Builds the plugin with its stores. */
export function deviceSignInPlugin(deps: { pins: PinStore; cards: CardDirectory }) {
  /** Starts a session for [userId] and sets the cookie; also returns the token for the app. */
  async function startSession(ctx: GenericEndpointContext, userId: string) {
    const user = await ctx.context.internalAdapter.findUserById(userId);
    if (!user) throw new APIError("UNAUTHORIZED", { message: "Account not found." });
    const session = await ctx.context.internalAdapter.createSession(userId);
    await setSessionCookie(ctx, { session, user });
    return ctx.json({ token: session.token, user: { id: user.id, name: user.name, email: user.email } });
  }

  /** A card sign-in endpoint for one kind of card. */
  const cardEndpoint = (kind: "nfc" | "qr") =>
    createAuthEndpoint(`/card/sign-in/${kind}`, { method: "POST", body: z.object({ value: z.string().min(4).max(500) }) }, async (ctx) => {
      const holder = await asApiError(() => deps.cards.holderOf(kind, ctx.body.value));
      if (!holder) throw new APIError("UNAUTHORIZED", { message: "This card is not recognised." });
      return startSession(ctx, holder);
    });

  return {
    id: "igongo-device-sign-in",
    endpoints: {
      setPin: createAuthEndpoint("/pin/set", { method: "POST", use: [sessionMiddleware], body: z.object({ deviceId, pin: z.string() }) }, async (ctx) => {
        await asApiError(() => setPin(deps.pins, ctx.context.session.user.id, ctx.body.deviceId, ctx.body.pin));
        return ctx.json({ ok: true });
      }),
      signInPin: createAuthEndpoint("/pin/sign-in", { method: "POST", body: z.object({ userId: z.string().max(80), deviceId, pin: z.string().max(8) }) }, async (ctx) => {
        await asApiError(() => verifyPin(deps.pins, ctx.body.userId, ctx.body.deviceId, ctx.body.pin, new Date()));
        return startSession(ctx, ctx.body.userId);
      }),
      signInCardNfc: cardEndpoint("nfc"),
      signInCardQr: cardEndpoint("qr"),
    },
  } satisfies BetterAuthPlugin;
}
