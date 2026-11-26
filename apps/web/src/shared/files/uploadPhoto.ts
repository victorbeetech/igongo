// Sends a photo (or any file) to Files & Media (module 11) and returns its
// ID, which other modules store, such as a fault's photo IDs.

import { api } from "@/shared/api/apiClient";
import { API_URL } from "@/shared/api/apiConfig";

/** Reads [file] as base64, without the `data:...;base64,` start. */
function base64Of(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads [file] for the module [purpose] (such as `faults-maintenance`).
 * @returns the new file's ID
 * @throws ApiError when the type, size or permission is refused
 */
export async function uploadPhoto(file: File, purpose: string): Promise<string> {
  const data = await base64Of(file);
  const saved = await api<{ id: string }>("/api/files", { method: "POST", body: { name: file.name, type: file.type || "application/octet-stream", data, purpose } });
  return saved.id;
}

/** Where a stored file can be shown, such as in an `<img>`. */
export const fileUrl = (id: string) => `${API_URL}/api/files/${id}`;
