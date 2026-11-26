"use client";
// Part 1 of the sign-in security page: a first password for an account made
// with Google or Apple. Needs a sign-in from the last 10 minutes.

import { useState, type FormEvent } from "react";
import { useSetFirstPassword } from "@/modules/m04-users-login/data/securityApi";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The first-password form. */
export function FirstPasswordSection() {
  const save = useSetFirstPassword();
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const mismatch = again.length > 0 && password !== again;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!mismatch) save.mutate(password);
  };
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-md border border-line p-3">
      <h2 className="text-subtitle font-bold">1. Add a password</h2>
      <p className="text-caption text-muted">Your account was made with Google or Apple. Super admins sign in with email, password and 2-step, so add a password first. At least 10 characters, with a letter and a number.</p>
      <TextInput label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />
      <TextInput label="New password again" type="password" value={again} onChange={setAgain} autoComplete="new-password" required />
      {mismatch && <p role="alert" className="text-caption text-error">The two passwords are not the same.</p>}
      <Button type="submit" disabled={save.isPending || mismatch}>{save.isPending ? "Saving…" : "Save password"}</Button>
    </form>
  );
}
