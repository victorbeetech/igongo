// The Igongo logo from the brand kit. Both colourways are in the page and CSS
// shows the right one for the theme: colour on light, reversed on dark, so
// the logo never flashes the wrong way. White is used on Igongo red.

/* eslint-disable @next/next/no-img-element -- brand SVGs are already optimised */

/** Which logo layout to show. */
export type LogoShape = "mark" | "horizontal" | "stacked";

/** Shows the Igongo logo at [height]. Set [onRed] on Igongo red. */
export function Logo({ shape = "mark", height = 40, onRed = false }: { shape?: LogoShape; height?: number; onRed?: boolean }) {
  const base = `/brand/logo/${shape}/igongo-${shape}`;
  // On red only the white mark is allowed; the name layouts use the reversed file.
  if (onRed) return <img src={`${base}-${shape === "mark" ? "white" : "reversed"}.svg`} alt="Igongo" style={{ height }} />;
  return (
    <>
      <img className="logo-light" src={`${base}-color.svg`} alt="Igongo" style={{ height }} />
      <img className="logo-dark" src={`${base}-reversed.svg`} alt="Igongo" style={{ height }} />
    </>
  );
}
