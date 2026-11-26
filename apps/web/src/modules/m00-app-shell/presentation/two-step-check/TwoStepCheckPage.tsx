"use client";
// S00-16 Two-factor check: the second step of signing in, for accounts with
// 2-step on. The 6-digit code from the authenticator app, or one of the
// recovery codes if the phone is lost (each recovery code works once).

import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { verifyRecoveryCode, verifyTwoStepCode } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The 2-step code page. */
export function TwoStepCheckPage() {
  const address = useAddress();
  const client = useQueryClient();
  const [recovery, setRecovery] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Checks the code, then opens the portal. */
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await (recovery ? verifyRecoveryCode(code.trim()) : verifyTwoStepCode(code.replace(/\s/g, "")));
      await client.invalidateQueries();
      address.push("/home");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "That code did not work. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 pt-2">
      <p className="text-caption text-muted">
        {recovery ? "Type one of the recovery codes you saved when you turned on 2-step. Each one works once." : "Open your authenticator app and type the 6-digit code for Igongo."}
      </p>
      <TextInput label={recovery ? "Recovery code" : "6-digit code"} value={code} onChange={setCode} autoComplete="one-time-code" hint={recovery ? "abcde-12345" : "123 456"} required />
      {error && <p role="alert" className="text-caption text-error">{error}</p>}
      <Button type="submit" disabled={busy || code.trim().length < 6} block>{busy ? "Checking…" : "Continue"}</Button>
      <Button variant="text" onClick={() => { setRecovery(!recovery); setCode(""); setError(null); }}>
        {recovery ? "Use the authenticator app instead" : "Lost your phone? Use a recovery code"}
      </Button>
      <Button variant="text" href="/sign-in">Back to sign in</Button>
    </form>
  );
}
