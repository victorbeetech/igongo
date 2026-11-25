// Where the Igongo API lives. The live portal (igongo.victorbee.com) talks
// to igongo-api.victorbee.com; set NEXT_PUBLIC_API_URL to use another one,
// such as http://localhost:8787 with `wrangler dev`.

/** The API's address, without a trailing slash. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://igongo-api.victorbee.com").replace(/\/$/, "");
