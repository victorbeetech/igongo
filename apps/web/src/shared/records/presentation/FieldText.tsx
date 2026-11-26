"use client";
// A saved field value as people read it: money in UGX, yes/no in words,
// photos as thumbnails, and an empty value as a dash.

import { PhotoStrip } from "@/shared/files/PhotoStrip";
import { ugx } from "@/shared/format/ugx";
import type { FieldDef, FieldValue } from "../types/fieldDef";

export function FieldText({ field, value }: { field: FieldDef; value: FieldValue | undefined }) {
  if (value === null || value === undefined || value === "") return <>-</>;
  if (field.kind === "photo") return <PhotoStrip ids={[String(value)]} />;
  if (field.kind === "yesno") return <>{value ? "Yes" : "No"}</>;
  if (field.kind === "money") return <>{ugx(Number(value))}</>;
  return <span className="whitespace-pre-wrap">{String(value)}</span>;
}
