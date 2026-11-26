"use client";
// Draws a live API query's states with the same designed state screens the
// prototype uses: loading, signed out, not allowed, error and empty.
// Pages only write the "normal" view.

import type { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle, Inbox, Lock, LogIn, RefreshCw, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button/Button";
import { StateMessage } from "@/shared/ui/message/StateMessage";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import { ApiError } from "./ApiError";

interface LiveDataProps<T> {
  /** The query to show. */
  query: UseQueryResult<T>;
  /** The page's name, for the messages. */
  name: string;
  /** True when the loaded data counts as empty. */
  isEmpty?: (data: T) => boolean;
  /** The normal view. */
  children: (data: T) => ReactNode;
}

/** The right state for [query]: its data, or a designed message. */
export function LiveData<T>({ query, name, isEmpty, children }: LiveDataProps<T>) {
  if (query.isPending) return <SkeletonList />;
  if (query.isError) return <ErrorState error={query.error} name={name} retry={() => void query.refetch()} />;
  if (isEmpty?.(query.data)) {
    return <StateMessage icon={<Inbox size={36} />} illustration="empty" tone="muted" title="Nothing here yet" message={`${name} will appear here.`} />;
  }
  return <>{children(query.data)}</>;
}

/** The message for a failed query. */
export function ErrorState({ error, name, retry }: { error: unknown; name: string; retry?: () => void }) {
  const e = error instanceof ApiError ? error : new ApiError(0, "error", String(error));
  if (e.needsSignIn) {
    return (
      <StateMessage icon={<LogIn size={36} />} illustration="denied" tone="warning" title="Please sign in" message={`Sign in to see ${name}.`}>
        <Button href="/sign-in">Sign in</Button>
      </StateMessage>
    );
  }
  // Step 1: the super admin (and sensitive roles) must set up 2-step before anything opens.
  if (e.code === "two_factor_required") {
    return (
      <StateMessage icon={<ShieldCheck size={36} />} illustration="denied" tone="warning" title="Set up 2-step sign-in first" message="Your role needs an authenticator app before these screens open. Set it up in Sign-in and 2-step.">
        <Button href="/link-sign-in-methods">Set up 2-step</Button>
      </StateMessage>
    );
  }
  if (e.denied) {
    return <StateMessage icon={<Lock size={36} />} illustration="denied" tone="warning" title="Your role can't open this" message={e.message} />;
  }
  return (
    <StateMessage icon={<AlertCircle size={36} />} illustration="error" tone="error" title="Something went wrong" message={`${e.message}${e.requestId ? ` (reference ${e.requestId})` : ""}`}>
      {retry && <Button icon={<RefreshCw size={16} />} onClick={retry}>Try again</Button>}
    </StateMessage>
  );
}
