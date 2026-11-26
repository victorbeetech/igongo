"use client";
// One-click print and download of a card (S16-03, S16-19): both sides at
// the card type's exact size in millimetres, one side per page, ready for
// a card printer set to "actual size". Download saves each side as SVG.

import { useRef } from "react";
import { Button } from "@/shared/ui/button/Button";
import type { CardHolder } from "../../domain/cardHolder";
import type { CardTemplate } from "../../domain/cardTemplate";
import type { CardType } from "../../domain/cardType";
import { CardCanvas } from "./CardCanvas";

export function CardPrint({ template, type, holder }: { template: CardTemplate; type: CardType | undefined; holder: CardHolder }) {
  const sides = useRef<HTMLDivElement>(null);
  // Portrait cards turn the card type's width and height round.
  const long = type ? Math.max(type.widthMm, type.heightMm) : 85.6;
  const short = type ? Math.min(type.widthMm, type.heightMm) : 54;
  const [wMm, hMm] = template.orientation === "portrait" ? [short, long] : [long, short];

  /** Each side's SVG, sized in millimetres. */
  const svgs = () => [...(sides.current?.querySelectorAll("svg") ?? [])].map((s) => s.outerHTML.replace(/width="[^"]*" height="[^"]*"/, `width="${wMm}mm" height="${hMm}mm"`));

  const print = () => {
    // Step 1: a page per side, at the exact card size, with the brand fonts.
    const win = window.open("", "_blank", "width=600,height=800");
    if (!win) return;
    const origin = window.location.origin;
    win.document.write(`<!doctype html><html><head><title>${template.name} card</title><style>
      @font-face{font-family:"Lato";src:url("${origin}/brand/fonts/Lato-Regular.ttf")}
      @font-face{font-family:"Lato";font-weight:700;src:url("${origin}/brand/fonts/Lato-Bold.ttf")}
      @font-face{font-family:"Cinzel";src:url("${origin}/brand/fonts/Cinzel-Variable.ttf")}
      :root{--font-brand:"Cinzel",serif;--font-body:"Lato",sans-serif}
      @page{size:${wMm}mm ${hMm}mm;margin:0}
      body{margin:0} svg{display:block;page-break-after:always;border-radius:0!important;box-shadow:none!important}
    </style></head><body>${svgs().join("").replaceAll('href="/', `href="${origin}/`)}</body></html>`);
    win.document.close();
    // Step 2: print once the fonts and images have loaded.
    win.onload = () => win.print();
  };

  const download = () => {
    svgs().forEach((svg, i) => {
      const url = URL.createObjectURL(new Blob([`<?xml version="1.0" encoding="UTF-8"?>${svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ')}`], { type: "image/svg+xml" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: `${template.key}-${i === 0 ? "front" : "back"}.svg` });
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div ref={sides} className="hidden" aria-hidden>
        <CardCanvas template={template} side={template.front} holder={holder} width={540} />
        <CardCanvas template={template} side={template.back} holder={holder} width={540} />
      </div>
      <Button onClick={print}>Print card</Button>
      <Button variant="secondary" onClick={download}>Download</Button>
      <span className="text-caption text-muted">{wMm} by {hMm} mm{type ? `, ${type.printPreset}` : ""}</span>
    </div>
  );
}
