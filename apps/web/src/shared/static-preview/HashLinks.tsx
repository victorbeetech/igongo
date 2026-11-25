"use client";
// Makes every link of the portal work inside the static preview: a click on a
// link to `/something` is turned into `#/something`, before Next.js sees it.
// So no link anywhere needs to know about the preview.

import { useEffect } from "react";
import { pushHash } from "./hashAddress";

/** Put once on the preview page. Draws nothing. */
export function HashLinks() {
  useEffect(() => {
    // Step 1: catch clicks first (capture), before the Next.js link handler.
    const onClick = (event: MouseEvent) => {
      // Step 2: leave new-tab clicks and links to other sites alone.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href?.startsWith("/") || href.startsWith("//") || link?.target === "_blank") return;
      // Step 3: go to the same address after `#` instead, and scroll to the top.
      event.preventDefault();
      event.stopPropagation();
      pushHash(href);
      window.scrollTo(0, 0);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
