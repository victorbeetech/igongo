"use client";
// S00-17 Forgot password: asks for the email and sends a reset link that
// works once, for one hour. The answer is the same whether or not the email
// has an account, so nobody can find out who works at the hotel. After
// sending, the page shows the Check Your Email view (a state of this page).

import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The forgot-password page, with its Check Your Email view. */
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

  // Step 1: the Check Your Email view, with a green tick and a button back to sign in.
  if (sent) {
    return (
      <div className="grid justify-items-center gap-3 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-success/15" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-10 fill-success"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 14.4-4.2-4.2 1.4-1.4 2.8 2.8 6-6 1.4 1.4-7.4 7.4Z" /></svg>
        </span>
        <h2 className="text-headline font-bold">Check Your Email!</h2>
        <p role="status" className="text-caption text-muted">
          If an account uses {email.trim().toLowerCase()}, a reset link is on its way. It works once, for one hour.
        </p>
        <Button variant="secondary" href="/sign-in" block>Back to Sign In</Button>
      </div>
    );
  }
  // Step 2: the form, with a back link, the email box, the reset button and the info note.
  return (
    <form onSubmit={submit} className="grid gap-3">
      <Button variant="text" href="/sign-in">← Back to sign in</Button>
      <p className="text-caption text-muted">Enter your email address and we&apos;ll send you a link to reset your password.</p>
      <TextInput label="Email address" type="email" value={email} onChange={setEmail} autoComplete="username" hint="name@example.com" required />
      {error && <p role="alert" className="text-caption text-error">{error}</p>}
      <Button type="submit" disabled={busy} block>{busy ? "Sending…" : "Send Reset Link"}</Button>
      <Button variant="text" href="/sign-in" block>Back to sign in</Button>
      <p className="rounded-md bg-surface-alt p-3 text-caption text-muted">Check your inbox for the reset link. It may take a few minutes.</p>
    </form>
  );
}
