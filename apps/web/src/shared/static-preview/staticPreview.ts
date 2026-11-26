// The static preview switch. When the portal is built with
// NEXT_PUBLIC_STATIC_PREVIEW=1 (`pnpm build:preview`), it becomes ONE page that
// draws every screen from the address after `#`, such as `#/role-switcher`.
// That lets the whole clickable prototype be hosted as a few static files
// (for example as a review link) with no server. The normal build is unchanged.

/** True only in the static preview build. Fixed at build time. */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

/**
 * The screen the site opens on when the address has no `#`. The hosted site
 * (`build:cloudflare`) opens on sign-in; a review build on the role switcher.
 */
export const PREVIEW_START = process.env.NEXT_PUBLIC_START_SCREEN ?? "/role-switcher";
