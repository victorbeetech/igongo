"use client";
// The staff card as the holder sees it: the default black portrait card from
// the brand kit, front and back. Click to turn it over.

/* eslint-disable @next/next/no-img-element -- the card image comes straight from the brand kit */

import { useState } from "react";

/** The black portrait staff card, which turns over on click. */
export function StaffCard({ width = 220 }: { width?: number }) {
  const [back, setBack] = useState(false);
  const side = back ? "back" : "front";
  return (
    <button type="button" onClick={() => setBack(!back)} aria-label={`Staff card, ${side}. Turn over`} className="rounded-md border border-line">
      <img src={`/brand/cards/portrait-black/portrait-black-${side}.png`} alt="" width={width} className="rounded-md" />
    </button>
  );
}
