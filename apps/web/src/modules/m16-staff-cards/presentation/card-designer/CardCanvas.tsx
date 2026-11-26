"use client";
// One card side drawn as SVG at its true proportions: background, colour
// blocks, logos, the holder's photo, their details and the QR code. In the
// designer, elements can be picked and dragged; elsewhere it is a picture.
// The same drawing prints at the card's exact size (CardPrint.tsx).

import { useRef, type PointerEvent } from "react";
import { qrPath } from "@/shared/ui/qr/qrPath";
import type { CardElement } from "../../domain/cardElement";
import type { CardHolder } from "../../domain/cardHolder";
import { sizeOf, type CardSide, type CardTemplate } from "../../domain/cardTemplate";
import { CARD_FONT, CARD_HEX, logoUrl } from "./brandColours";

interface CardCanvasProps {
  template: CardTemplate;
  side: CardSide;
  holder: CardHolder;
  /** Drawn width in CSS pixels. */
  width: number;
  /** Designer only: the picked element and how to pick and move one. */
  selected?: string;
  onSelect?: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
}

export function CardCanvas({ template, side, holder, width, selected, onSelect, onMove }: CardCanvasProps) {
  const { w, h } = sizeOf(template.orientation);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  /** The pointer's place in card units. */
  const at = (e: PointerEvent) => {
    const box = svg.current?.getBoundingClientRect();
    return box ? { x: ((e.clientX - box.left) / box.width) * w, y: ((e.clientY - box.top) / box.height) * h } : { x: 0, y: 0 };
  };
  const down = (el: CardElement) => (e: PointerEvent) => {
    if (!onSelect) return;
    onSelect(el.id);
    const p = at(e);
    drag.current = { id: el.id, dx: p.x - el.x, dy: p.y - el.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!drag.current || !onMove) return;
    const p = at(e);
    onMove(drag.current.id, Math.round(p.x - drag.current.dx), Math.round(p.y - drag.current.dy));
  };

  return (
    <svg ref={svg} viewBox={`0 0 ${w} ${h}`} width={width} height={(width * h) / w} role="img" aria-label={`${template.name} card`} className="rounded-lg shadow-md" onPointerMove={move} onPointerUp={() => (drag.current = null)}>
      <rect width={w} height={h} rx={32} fill={CARD_HEX[side.background]} />
      {side.elements.map((el) => (
        <g key={el.id} onPointerDown={down(el)} style={onSelect ? { cursor: "move" } : undefined}>
          <Element el={el} holder={holder} />
          {selected === el.id && <rect x={el.x} y={el.y} width={el.w} height={el.h} fill="none" stroke={CARD_HEX.red} strokeWidth={4} strokeDasharray="12 8" />}
        </g>
      ))}
    </svg>
  );
}

/** One element's drawing. */
function Element({ el, holder }: { el: CardElement; holder: CardHolder }) {
  switch (el.kind) {
    case "shape":
      return <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.radius} fill={CARD_HEX[el.colour]} />;
    case "logo":
      return <image href={logoUrl(el.logo ?? "spiral", el.colour)} x={el.x} y={el.y} width={el.w} height={el.h} preserveAspectRatio="xMidYMid meet" />;
    case "photo":
      return holder.photoUrl ? (
        <image href={holder.photoUrl} x={el.x} y={el.y} width={el.w} height={el.h} preserveAspectRatio="xMidYMid slice" clipPath={`inset(0 round ${el.radius}px)`} />
      ) : (
        <g>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.radius} fill={CARD_HEX.cream} opacity={0.25} />
          <text x={el.x + el.w / 2} y={el.y + el.h / 2} fill={CARD_HEX.cream} fontSize={28} textAnchor="middle" dominantBaseline="middle" fontFamily={CARD_FONT.body}>Photo</text>
        </g>
      );
    case "qr": {
      // A white quiet zone keeps the code readable on any background.
      const pad = el.w * 0.06;
      return (
        <g>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={12} fill={CARD_HEX.white} />
          <path transform={`translate(${el.x + pad} ${el.y + pad})`} d={qrPath(holder.qr, Math.min(el.w, el.h) - pad * 2)} fill={CARD_HEX[el.colour === "white" || el.colour === "cream" ? "black" : el.colour]} />
        </g>
      );
    }
    default: {
      const words = el.kind === "text" ? (el.text ?? "") : (holder[el.field ?? "full_name"] ?? "");
      const x = el.align === "start" ? el.x : el.align === "end" ? el.x + el.w : el.x + el.w / 2;
      return (
        <text x={x} y={el.y + el.h / 2} fill={CARD_HEX[el.colour]} fontSize={el.size} fontWeight={el.bold ? 700 : 400} fontFamily={CARD_FONT[el.font]} textAnchor={el.align} dominantBaseline="middle" textLength={fits(words, el) ? undefined : el.w} lengthAdjust="spacingAndGlyphs">
          {words}
        </text>
      );
    }
  }
}

/** True when [words] fit the box at their size (roughly 0.55 em a letter); otherwise they are squeezed to fit. */
const fits = (words: string, el: CardElement) => words.length * el.size * 0.55 <= el.w;
