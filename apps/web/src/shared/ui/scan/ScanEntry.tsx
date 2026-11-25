"use client";
// The box a station reads cards and bands into (gate, reception, canteen,
// event doors). A USB NFC reader or QR scanner types into it and presses
// Enter; staff can also type a UID or paste QR text. Keeps focus so the next
// tap goes straight in.

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button/Button";
import { scanOf, type Scan } from "./scanOf";

interface ScanEntryProps {
  /** Called with each scan. */
  onScan: (scan: Scan) => void;
  /** The button's words, such as "Clock in or out". */
  action: string;
  busy?: boolean;
}

/** A focused input that sends each tap or scan. */
export function ScanEntry({ onScan, action, busy }: ScanEntryProps) {
  const [text, setText] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const scan = scanOf(text);
    if (!scan) return;
    onScan(scan);
    // Clear for the next person.
    setText("");
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <label className="grid min-w-56 flex-1 gap-1 text-label">
        Tap the card on the reader, or scan its QR code
        <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Card UID or QR text" className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body" />
      </label>
      <Button type="submit" disabled={busy}>{action}</Button>
    </form>
  );
}
