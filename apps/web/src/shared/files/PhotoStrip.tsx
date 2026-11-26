// A row of stored photos, each opening full size in a new tab.

import { fileUrl } from "./uploadPhoto";

/** The photos with IDs [ids]; nothing when there are none. */
export function PhotoStrip({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id) => (
        <a key={id} href={fileUrl(id)} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- photos come from the API with the session cookie */}
          <img src={fileUrl(id)} alt="Photo" className="size-24 rounded-md border border-line object-cover" />
        </a>
      ))}
    </div>
  );
}
