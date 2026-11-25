/**
 * Stand-ins used until the outside services are set up: SMS, WhatsApp and
 * email codes (Phase 8) and staff cards (module 16). They refuse clearly
 * with `not_configured`, so the methods stay switched off without errors.
 */

import { AppError } from "@igongo/core";
import type { CardDirectory } from "../../application/ports/card-directory";
import type { CodeChannel, CodeSender } from "../../application/ports/code-sender";

/** Refuses to send any code. */
export const notConfiguredCodeSender: CodeSender = {
  async send(channel: CodeChannel) {
    throw new AppError("not_configured", `Sending codes by ${channel} is not set up yet.`);
  },
};

/** Knows no cards. */
export const notConfiguredCardDirectory: CardDirectory = {
  async holderOf() {
    throw new AppError("not_configured", "Staff card sign-in is not set up yet.");
  },
};
