// A drawn site map with pins, standing in for Google Maps until Phase 8.

import { MapPin } from "lucide-react";

// Places on the sample map, as percentages across and down.
const PINS = [
  { x: 25, y: 30, label: "Main building" },
  { x: 62, y: 45, label: "Museum" },
  { x: 40, y: 72, label: "Pool" },
];

/** A sample map of the Igongo grounds. */
export function MapPlaceholder() {
  return (
    <div role="img" aria-label="Map of the Igongo grounds" className="relative h-64 overflow-hidden rounded-md bg-surface-alt">
      {/* Two roads, drawn in the border colour so they work in both modes. */}
      <svg className="absolute inset-0 size-full text-line" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <path d="M0 55 L100 40 M50 0 L45 100" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
      {PINS.map((p) => (
        <span key={p.label} className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <MapPin className="text-primary" fill="currentColor" size={28} aria-hidden />
          <span className="text-caption font-bold">{p.label}</span>
        </span>
      ))}
    </div>
  );
}
