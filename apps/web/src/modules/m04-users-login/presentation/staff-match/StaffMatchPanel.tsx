"use client";
// The super admin's staff match, on a guest account's page: the person
// signed up in the app as a guest; the super admin types their staff number
// and the phone they give, and the server checks both, and the name, against
// the HR staff record. Only then does the account become staff.

import { useState, type FormEvent } from "react";
import { useStaffMatch } from "@/modules/m04-users-login/data/securityApi";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The match form for guest account [userId]. */
export function StaffMatchPanel({ userId, emailVerified }: { userId: string; emailVerified: boolean }) {
  const match = useStaffMatch(userId);
  const [staffNumber, setStaffNumber] = useState("");
  const [phone, setPhone] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    match.mutate({ staffNumber, phone });
  };
  return (
    <Card>
      <form onSubmit={submit} className="grid gap-3">
        <h2 className="text-subtitle font-bold">Make this person staff</h2>
        <p className="text-caption text-muted">
          Match this guest account to the person&apos;s HR staff record. Their name, phone and staff number must all match the record, and the change is recorded.
        </p>
        {!emailVerified && <p role="alert" className="text-caption text-error">The person must verify their email in the app first.</p>}
        <TextInput label="Staff number" value={staffNumber} onChange={setStaffNumber} hint="IGG-0042" required />
        <TextInput label="Phone the person gives you" type="tel" value={phone} onChange={setPhone} autoComplete="off" hint="0772 123 456" required />
        <Button type="submit" disabled={match.isPending || !emailVerified}>{match.isPending ? "Checking…" : "Check and match"}</Button>
      </form>
    </Card>
  );
}
