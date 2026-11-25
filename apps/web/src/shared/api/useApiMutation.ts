"use client";
// A change sent to the API, with the toast and cache refresh every form
// needs: on success it shows [done] and refreshes the queries under
// [refresh]; on failure it shows the API's message.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/shared/ui/toast/toast";
import { ApiError } from "./ApiError";

/** A mutation that calls [send], then toasts and refreshes. */
export function useApiMutation<I, O>(send: (input: I) => Promise<O>, { done, refresh }: { done: string; refresh: string[][] }) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: send,
    onSuccess: async () => {
      showToast(done);
      await Promise.all(refresh.map((key) => client.invalidateQueries({ queryKey: key })));
    },
    onError: (error) => showToast(error instanceof ApiError ? error.message : "Something went wrong."),
  });
}
