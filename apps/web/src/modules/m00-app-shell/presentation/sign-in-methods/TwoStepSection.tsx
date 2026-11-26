"use client";
// Part 2 of the sign-in security page: 2-step with an authenticator app
// (Google Authenticator, Microsoft Authenticator, 1Password...).
// Steps: confirm the password, scan the QR code, save the recovery codes,
// type the first code. Once on, new recovery codes can be made.

import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { enableTwoStep, newRecoveryCodes, verifyTwoStepCode } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { ME_KEY } from "@/shared/session/useMe";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { qrPath } from "@/shared/ui/qr/qrPath";
import { RecoveryCodes } from "./RecoveryCodes";

/** The 2-step part. */
export function TwoStepSection({ enabled, hasPassword }: { enabled: boolean; hasPassword: boolean }) {
  const client = useQueryClient();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [started, setStarted] = useState<{ totpURI: string; backupCodes: string[] } | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Runs [work], showing its error in words. */
  const run = (work: () => Promise<void>) => async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await work();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "That did not work. Try again.");
    } finally {
      setBusy(false);
    }
  };
  // Step 1: the password starts it; Step 3: the first code finishes it.
  const start = run(async () => setStarted(await enableTwoStep(password)));
  const finish = run(async () => {
    await verifyTwoStepCode(code.replace(/\s/g, ""));
    await client.invalidateQueries({ queryKey: ME_KEY });
    setStarted(null);
  });
  const regenerate = run(async () => setCodes((await newRecoveryCodes(password)).backupCodes));
  const secret = started ? (new URL(started.totpURI).searchParams.get("secret") ?? "") : "";

  return (
    <section className="grid gap-3 rounded-md border border-line p-3">
      <h2 className="flex items-center gap-2 text-subtitle font-bold">
        {hasPassword ? "" : "2. "}2-step sign-in
        {enabled && <span className="inline-flex items-center gap-1 text-caption text-success"><ShieldCheck size={14} aria-hidden />On</span>}
      </h2>
      {!enabled && !started && (
        <form onSubmit={start} className="grid gap-3">
          <p className="text-caption text-muted">After your password, Igongo will ask for a 6-digit code from an authenticator app on your phone. A stolen password alone is then not enough.</p>
          <TextInput label="Your password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
          <Button type="submit" disabled={busy || !hasPassword}>{busy ? "Starting…" : "Turn on 2-step"}</Button>
        </form>
      )}
      {started && (
        <form onSubmit={finish} className="grid gap-3">
          <p className="text-caption">Scan this with your authenticator app, or type the key by hand.</p>
          {/* Dark on light in both themes: authenticator apps only read it that way. */}
          <svg viewBox="0 0 180 180" className="size-44 justify-self-center rounded-md bg-white p-2" role="img" aria-label="QR code for your authenticator app">
            <path d={qrPath(started.totpURI, 164)} fill="black" />
          </svg>
          <code className="justify-self-center break-all rounded bg-surface-alt px-2 py-1 text-caption">{secret}</code>
          <RecoveryCodes codes={started.backupCodes} />
          <TextInput label="The 6-digit code from the app" value={code} onChange={setCode} autoComplete="one-time-code" hint="123 456" required />
          <Button type="submit" disabled={busy}>{busy ? "Checking…" : "Finish"}</Button>
        </form>
      )}
      {enabled && (
        <form onSubmit={regenerate} className="grid gap-3">
          <p className="text-caption text-muted">Lost your recovery codes? Make new ones; the old ones stop working.</p>
          {codes ? <RecoveryCodes codes={codes} /> : <TextInput label="Your password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />}
          {!codes && <Button variant="secondary" type="submit" disabled={busy}>New recovery codes</Button>}
        </form>
      )}
      {error && <p role="alert" className="text-caption text-error">{error}</p>}
    </section>
  );
}
