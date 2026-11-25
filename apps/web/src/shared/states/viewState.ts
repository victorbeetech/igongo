// The states every screen must design for. In the prototype they are picked
// in the preview panel; later the data layer sets them.

/** Every state a screen can be in, with the name shown in the preview panel. */
export const VIEW_STATES = {
  normal: "Normal",
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  offline: "Offline",
  denied: "Permission denied",
  success: "Success",
} as const;

/** One state a screen can be in. */
export type ViewState = keyof typeof VIEW_STATES;
