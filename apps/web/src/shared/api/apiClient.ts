// The one way the portal calls the API: JSON in and out, the session cookie
// sent with every call, and every refusal turned into an ApiError.

import { ApiError } from "./ApiError";
import { API_URL } from "./apiConfig";

/** Options for one call. */
interface CallOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
}

/**
 * Calls the API at [path] (such as `/api/access/roles`) and returns its JSON.
 * @throws ApiError when the API refuses, or with status 0 when offline
 */
export async function api<T>(path: string, { method = "GET", body }: CallOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      // The session cookie belongs to the API's address; include it.
      credentials: "include",
      headers: body === undefined ? {} : { "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError(0, "offline", "We couldn't reach Igongo. Check your connection and try again.");
  }
  // Step 2: read the reply (some replies, such as 204, have none).
  const text = await res.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!res.ok) {
    const code = String(data["error"] ?? data["code"] ?? "error");
    throw new ApiError(res.status, code, String(data["message"] ?? "Something went wrong."), data["requestId"] as string | undefined);
  }
  return data as T;
}
