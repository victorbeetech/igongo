/**
 * Wristbands HTTP routes, mounted by the gateway at `/api/wristbands`.
 *
 *   GET    /wristbands/summary          stock and bands out per event (S17-01, S17-02)
 *   GET    /wristbands                  list, by status, event or range (S17-05)
 *   POST   /wristbands/register-range   register new bands once (S17-03)
 *   POST   /wristbands/assign-range     give a range to an event (S17-06)
 *   POST   /wristbands/reset-range      take a range back after an event
 *   POST   /wristbands/scan             a door scan, with the verdict (S17-07)
 *   GET    /wristbands/scans            the scan log (S17-10)
 *   GET    /wristbands/:number          one band and its recent scans (S17-08)
 *   PATCH  /wristbands/:number          missing, retired, back in stock, or encode
 */

import { zValidator } from "@hono/zod-validator";
import { AppError, requirePermission, type ActorEnv, type ChangeContext } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { BandRepository } from "../application/ports/band-repository";
import { assignRange } from "../application/use-cases/assign-range";
import { updateBand } from "../application/use-cases/mark-band";
import { registerRange } from "../application/use-cases/register-range";
import { resetRange } from "../application/use-cases/reset-range";
import { scanBand } from "../application/use-cases/scan-band";
import { bandQrText } from "../domain/band-codes";
import type { Wristband } from "../domain/wristband";
import { BAND_PERMISSIONS as P } from "./permissions";
import { assignBody, listQuery, registerBody, resetBody, scanBody, scansQuery, updateBody } from "./request-schemas";

/** What the routes need, built per request by the gateway. */
export interface WristbandsDeps {
  bands: BandRepository;
  change: ChangeContext;
}

/** A band as the API shows it: the token becomes the full QR text. */
function view(band: Wristband) {
  const { qrToken, ...rest } = band;
  return { ...rest, qr: bandQrText(band.bandNumber, qrToken) };
}

/** The band number in the address. @throws AppError `bad_request` */
function numberParam(c: Context<ActorEnv>): number {
  const n = Number(c.req.param("number"));
  if (!Number.isInteger(n) || n < 1) throw new AppError("bad_request", "That is not a band number.");
  return n;
}

export function wristbandsRouter(deps: (c: Context<ActorEnv>) => WristbandsDeps) {
  return new Hono<ActorEnv>()
    .get("/summary", requirePermission(P.view), async (c) => c.json(await deps(c).bands.summary()))
    .get("/", requirePermission(P.view), zValidator("query", listQuery), async (c) => {
      const { from, to, ...rest } = c.req.valid("query");
      const items = await deps(c).bands.list({ ...rest, ...(from && to ? { range: { from, to } } : {}) });
      return c.json({ items: items.map(view) });
    })
    .post("/register-range", requirePermission(P.create), zValidator("json", registerBody), async (c) => c.json(await registerRange(deps(c).bands, deps(c).change, c.req.valid("json")), 201))
    .post("/assign-range", requirePermission(P.edit), zValidator("json", assignBody), async (c) => c.json(await assignRange(deps(c).bands, deps(c).change, c.req.valid("json"))))
    .post("/reset-range", requirePermission(P.edit), zValidator("json", resetBody), async (c) => c.json(await resetRange(deps(c).bands, deps(c).change, c.req.valid("json"))))
    .post("/scan", requirePermission(P.view), zValidator("json", scanBody), async (c) => {
      const { result, band } = await scanBand(deps(c).bands, deps(c).change, c.req.valid("json"));
      return c.json({ result, band: band ? view(band) : null });
    })
    .get("/scans", requirePermission(P.view), zValidator("query", scansQuery), async (c) => c.json({ items: await deps(c).bands.scans(c.req.valid("query")) }))
    .get("/:number", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const band = await d.bands.get(numberParam(c));
      if (!band) throw new AppError("not_found", "Band not registered.");
      return c.json({ band: view(band), scans: await d.bands.scans({ bandNumber: band.bandNumber, limit: 20 }) });
    })
    .patch("/:number", requirePermission(P.edit), zValidator("json", updateBody), async (c) => c.json(view(await updateBand(deps(c).bands, deps(c).change, numberParam(c), c.req.valid("json")))));
}
