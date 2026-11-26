"use client";
// S00-17 Forgot password: asks for the email and sends a reset link that
// works once, for one hour. The answer is the same whether or not the email
// has an account, so nobody can find out who works at the hotel.

import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The forgot-password page. */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Sends the link; it comes back to the new-password page. */
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(email.trim().toLowerCase(), absoluteUrl("/password-entry"));
      setSent(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "We couldn't send the link. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="grid gap-3 p-4 pt-2">
        <p role="status" className="text-body">If an account uses {email.trim().toLowerCase()}, a reset link is on its way. It works once, for one hour.</p>
        <Button variant="secondary" href="/sign-in" block>Back to sign in</Button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-3 p-4 pt-2">
      <p className="text-caption text-muted">Type the email you sign in with. We will send a link to set a new password.</p>
      <TextInput label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" hint="name@example.com" required />
      {error && <p role="alert" className="text-caption text-error">{error}</p>}
      <Button type="submit" disabled={busy} block>{busy ? "Sending…" : "Send the link"}</Button>
      <Button variant="text" href="/sign-in">Back to sign in</Button>
    </form>
  );
}
