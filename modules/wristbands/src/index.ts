/**
 * Wristbands (module 17) of the Igongo API. The gateway imports only this
 * file. See modules/wristbands/README.md.
 */

export type { BandRepository } from "./application/ports/band-repository";
export { bandQrText, parseBandQr } from "./domain/band-codes";
export { scanVerdict } from "./domain/scan-verdict";
export type { Wristband } from "./domain/wristband";
export { DrizzleBandRepository } from "./infrastructure/db/drizzle-band-repository";
export { BAND_PERMISSIONS } from "./presentation/permissions";
export { wristbandsRouter, type WristbandsDeps } from "./presentation/wristbands-router";
