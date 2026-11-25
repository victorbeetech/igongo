/**
 * Staff Cards HTTP routes, mounted by the gateway at `/api/cards`.
 *
 *   GET   /cards/mine          my card, with its QR text (S16-19)
 *   GET   /cards/summary       counts per status (S16-01)
 *   GET   /cards               the cards list (S16-08)
 *   POST  /cards               register a blank card (S16-13)
 *   POST  /cards/resolve       who owns this card (S16-15, S16-16, S16-17)
 *   GET   /cards/:id           detail with holder and history (S16-09)
 *   POST  /cards/:id/issue     give it to a staff member (S16-10)
 *   POST  /cards/:id/encode    link the NFC chip (S16-13)
 *   POST  /cards/:id/reset     back to stock (S16-18)
 *   POST  /cards/:id/lost      stop it working (S16-17)
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import { actorOf, AppError, requirePermission, type ActorEnv, type ChangeContext } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { CardRepository } from "../application/ports/card-repository";
import { encodeCard } from "../application/use-cases/encode-card";
import { issueCard } from "../application/use-cases/issue-card";
import { registerCard } from "../application/use-cases/register-card";
import { reportCardLost } from "../application/use-cases/report-card-lost";
import { resetCard } from "../application/use-cases/reset-card";
import { findCard } from "../application/use-cases/resolve-card";
import type { Card } from "../domain/card";
import { cardQrText } from "../domain/card-codes";
import { CARD_PERMISSIONS as P } from "./permissions";
import { encodeBody, issueBody, listQuery, registerBody, scanBody } from "./request-schemas";

/** What the routes need, built per request by the gateway. */
export interface CardsDeps {
  cards: CardRepository;
  staff: StaffDirectory;
  change: ChangeContext;
}

/** A card as the API shows it: the QR token becomes the full QR text. */
function view(card: Card) {
  const { qrToken, ...rest } = card;
  return { ...rest, qr: cardQrText(qrToken) };
}

export function cardsRouter(deps: (c: Context<ActorEnv>) => CardsDeps) {
  return (
    new Hono<ActorEnv>()
      // My own active card, for the card screen in the app.
      .get("/mine", async (c) => {
        const d = deps(c);
        const self = await d.staff.byUserId(actorOf(c).userId);
        if (!self) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
        const [card] = await d.cards.list({ staffId: self.staffId, status: "active", limit: 1, offset: 0 });
        return c.json({ card: card ? view(card) : null, holder: self });
      })
      .get("/summary", requirePermission(P.view), async (c) => c.json(await deps(c).cards.countByStatus()))
      .get("/", requirePermission(P.view), zValidator("query", listQuery), async (c) => {
        const d = deps(c);
        const items = await d.cards.list(c.req.valid("query"));
        // Attach each holder's name for the list.
        const holders = new Map((await d.staff.byIds(items.flatMap((i) => (i.staffId ? [i.staffId] : [])))).map((s) => [s.staffId, s]));
        return c.json({ items: items.map((i) => ({ ...view(i), holder: i.staffId ? (holders.get(i.staffId) ?? null) : null })) });
      })
      .post("/", requirePermission(P.create), zValidator("json", registerBody), async (c) => {
        return c.json(view(await registerCard(deps(c).cards, deps(c).change, c.req.valid("json"))), 201);
      })
      .post("/resolve", requirePermission(P.view), zValidator("json", scanBody), async (c) => {
        const d = deps(c);
        const card = await findCard(d.cards, c.req.valid("json"));
        if (!card) throw new AppError("not_found", "This card is not registered.");
        return c.json({ card: view(card), holder: card.staffId ? await d.staff.byId(card.staffId) : null });
      })
      .get("/:id", requirePermission(P.view), async (c) => {
        const d = deps(c);
        const card = await d.cards.get(c.req.param("id"));
        if (!card) throw new AppError("not_found", "Card not found.");
        return c.json({ card: view(card), holder: card.staffId ? await d.staff.byId(card.staffId) : null, history: await d.cards.history(card.cardId) });
      })
      .post("/:id/issue", requirePermission(P.create), zValidator("json", issueBody), async (c) => {
        return c.json(view(await issueCard(deps(c), deps(c).change, c.req.param("id"), c.req.valid("json"))));
      })
      .post("/:id/encode", requirePermission(P.edit), zValidator("json", encodeBody), async (c) => {
        return c.json(view(await encodeCard(deps(c).cards, deps(c).change, c.req.param("id"), c.req.valid("json").uid)));
      })
      .post("/:id/reset", requirePermission(P.edit), async (c) => c.json(view(await resetCard(deps(c).cards, deps(c).change, c.req.param("id")))))
      .post("/:id/lost", requirePermission(P.edit), async (c) => c.json(view(await reportCardLost(deps(c).cards, deps(c).change, c.req.param("id")))))
  );
}
