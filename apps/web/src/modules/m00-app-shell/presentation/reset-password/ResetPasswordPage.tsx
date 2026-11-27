"use client";
// S00-12 Password entry, used for the new password after a reset link. The
// link brings `?token=...`; an expired or used link brings `?error=...`.
// A reset signs the account out on every device.

import { useState, type FormEvent } from "react";
import { resetPassword } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { PasswordInput } from "@/shared/ui/field/PasswordInput";
import { passwordsMatch, PASSWORDS_DIFFER_MESSAGE } from "@/shared/validation/passwordsMatch";

/** The new-password page. */
export function ResetPasswordPage() {
  const address = useAddress();
  const token = address.params.get("token");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  // One eye shows or hides both boxes together.
  const [shown, setShown] = useState(false);

  /** Saves the new password. */
  async function submit(event: FormEvent) {
    event.preventDefault();
    // Step 1: the confirm box must match before anything is sent.
    if (!passwordsMatch(password, again)) return setError(PASSWORDS_DIFFER_MESSAGE);
    setBusy(true);
    setError(null);
    try {
      await resetPassword(token ?? "", password);
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "We couldn't save the password. Try again.");
    } finally {
      setBusy(false);
    }
  }

  // A missing, used or expired link.
  if (!token) {
    return (
      <div className="grid gap-3 p-4 pt-2">
        <p role="alert" className="text-body">This reset link has expired or was already used. Ask for a new one.</p>
        <Button href="/forgot-password" block>Send a new link</Button>
      </div>
    );
  }
  if (done) {
    return (
      <div className="grid gap-3 p-4 pt-2">
        <p role="status" className="text-body">Your new password is saved. You were signed out on every device.</p>
        <Button href="/sign-in" block>Sign in</Button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-3 p-4 pt-2">
      <p className="text-caption text-muted">Choose a new password: at least 8 characters, with a letter and a number.</p>
      <PasswordInput label="New password" value={password} onChange={setPassword} shown={shown} onToggle={() => setShown(!shown)} autoComplete="new-password" required />
      <PasswordInput label="New password again" value={again} onChange={setAgain} shown={shown} onToggle={() => setShown(!shown)} autoComplete="new-password" required />
      {error && <p role="alert" className="text-caption text-error">{error}</p>}
      <Button type="submit" disabled={busy} block>{busy ? "Saving…" : "Save the new password"}</Button>
    </form>
  );
}
