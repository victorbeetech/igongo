/** One module migration, as bundled into the Worker. */

export interface Migration {
  /** The module that owns it, such as `roles-permissions`. */
  module: string;
  /** The file name without `.sql`, such as `0000_roles`. */
  name: string;
  /** First 16 hex of the SQL's SHA-256, to spot a changed file. */
  checksum: string;
  /** The SQL, with drizzle-kit's `--> statement-breakpoint` separators. */
  sql: string;
}
