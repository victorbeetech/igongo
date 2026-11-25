// Draws a page's non-normal states: loading, empty, error, permission denied
// and success. Offline is a banner over the normal content instead, because
// saved items still show when the network is lost.

"use client";

import { AlertCircle, CheckCircle2, Inbox, Lock, Plus, RefreshCw } from "lucide-react";
import { setPreferences } from "@/shared/preferences/usePreferences";
import { Button } from "@/shared/ui/button/Button";
import { StateMessage } from "@/shared/ui/message/StateMessage";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import type { ViewState } from "./viewState";

/** The body for [state] on the page called [name]. */
export function StateView({ state, name }: { state: ViewState; name: string }) {
  // "Try again" returns the preview to the normal state.
  const retry = () => setPreferences({ state: "normal" });
  const back = <Button variant="secondary" href="/home">Back to home</Button>;
  switch (state) {
    case "loading":
      return <SkeletonList />;
    case "empty":
      return (
        <StateMessage icon={<Inbox size={36} />} title="Nothing here yet" message={`${name} will appear here. Add the first one to get started.`}>
          <Button icon={<Plus size={16} />} onClick={retry}>Add the first one</Button>
        </StateMessage>
      );
    case "error":
      return (
        <StateMessage icon={<AlertCircle size={36} />} tone="error" title="Something went wrong" message={`We couldn't load ${name}. Check your connection and try again, or report it.`}>
          <Button icon={<RefreshCw size={16} />} onClick={retry}>Try again</Button>
          {back}
        </StateMessage>
      );
    case "denied":
      return (
        <StateMessage icon={<Lock size={36} />} tone="warning" title="Your role can't open this" message={`Ask your head of department or the super admin to give your role access to ${name}.`}>
          {back}
        </StateMessage>
      );
    case "success":
      return (
        <StateMessage icon={<CheckCircle2 size={36} />} tone="success" title="Done" message="Saved and sent. Everyone who needs to know has been told.">
          <Button href="/home">Done</Button>
        </StateMessage>
      );
    default:
      // Normal and offline draw the page's own content, so they never reach here.
      return null;
  }
}
