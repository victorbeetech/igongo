// The brand loader: the Igongo spiral turning. It stops when the device asks
// for reduced motion (see globals.css).

/* eslint-disable @next/next/no-img-element -- a small SVG from the brand kit needs no image optimiser */

/** The turning Igongo spiral. */
export function SpiralLoader({ size = 36 }: { size?: number }) {
  return <img src="/brand/logo/spiral/igongo-spiral-red.svg" alt="Loading" width={size} height={size} className="spin" />;
}
