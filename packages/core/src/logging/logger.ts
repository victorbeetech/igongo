/**
 * The shared logger. Writes one JSON line per event, which Cloudflare Workers
 * Logs indexes, so logs can be searched by request ID. Never log secrets,
 * passwords, codes or tokens.
 */

/** How serious a log line is. */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** A logger bound to fixed fields, such as the request ID. */
export interface Logger {
  /** Writes one line at [level] with a message and extra fields. */
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  /** A logger that adds [fields] to every line. */
  child(fields: Record<string, unknown>): Logger;
}

/**
 * Makes a logger that writes JSON lines to the console.
 * @param base fields added to every line
 */
export function createLogger(base: Record<string, unknown> = {}): Logger {
  return {
    log(level, message, fields) {
      const line = JSON.stringify({ level, message, ...base, ...fields, at: new Date().toISOString() });
      // The one place console output is allowed: the logger itself.
      // eslint-disable-next-line no-console
      (level === "error" ? console.error : console.log)(line);
    },
    child(fields) {
      return createLogger({ ...base, ...fields });
    },
  };
}
