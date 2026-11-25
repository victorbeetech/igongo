"use client";
// The current address and how to move, for code that reads `?dialog=` or
// changes the address itself. It uses the Next.js router in the normal build
// and the `#` address in the static preview, so callers never need to know.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { pushHash, readHash, replaceHash, splitAddress, subscribeHash } from "@/shared/static-preview/hashAddress";
import { PREVIEW_START, STATIC_PREVIEW } from "@/shared/static-preview/staticPreview";

/** The address parts and the two ways to move. */
export interface Address {
  /** The path, such as `/staff/sample`. */
  path: string;
  /** The query, such as `dialog=block-card`. */
  params: URLSearchParams;
  /** Goes to an address, adding a history step. */
  push: (href: string) => void;
  /** Swaps the address without a history step. */
  replace: (href: string) => void;
}

/** The normal build: the Next.js router. */
function useRouterAddress(): Address {
  const path = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  return { path, params: new URLSearchParams(params.toString()), push: (h) => router.push(h), replace: (h) => router.replace(h, { scroll: false }) };
}

/** The static preview: the address after `#`. */
function useHashAddress(): Address {
  const address = useSyncExternalStore(subscribeHash, readHash, () => PREVIEW_START);
  const { path, query } = splitAddress(address);
  return { path, params: new URLSearchParams(query), push: pushHash, replace: replaceHash };
}

/** The current address. The choice is fixed at build time, so hook order never changes. */
export const useAddress: () => Address = STATIC_PREVIEW ? useHashAddress : useRouterAddress;
