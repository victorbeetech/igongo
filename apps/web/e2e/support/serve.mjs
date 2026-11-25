// A tiny static file server for the preview build in out/, used only by the
// browser checks. No dependencies: Node's own http module.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../out", import.meta.url));
// The file types the preview contains.
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".ttf": "font/ttf", ".ico": "image/x-icon", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

createServer((req, res) => {
  // Step 1: the file for the address, never outside out/.
  const path = normalize(join(root, decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)));
  const file = path.startsWith(root) && existsSync(path) && statSync(path).isDirectory() ? join(path, "index.html") : path;
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  // Step 2: send it with its type.
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(4173);
