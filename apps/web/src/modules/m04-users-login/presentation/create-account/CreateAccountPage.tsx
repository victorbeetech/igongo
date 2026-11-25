"use client";
// S04-03 Create account: an admin makes a staff account. The password is
// optional (staff can also use Google, a PIN or their card). After saving,
// the account page opens so roles can be given.

import { useState, type FormEvent } from "react";
import { useCreateAccount } from "@/modules/m04-users-login/data/accountsApi";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The create account form. */
export function CreateAccountPage({ screen }: { screen: ScreenContext }) {
  const address = useAddress();
  const create = useCreateAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate({ name, email, ...(password ? { password } : {}) }, { onSuccess: ({ id }) => address.push(recordHref(catalog.screen("S04-02")!, id)) });
  }

  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <form onSubmit={submit} className="grid max-w-lg gap-3 p-4">
        <TextInput label="Full name" value={name} onChange={setName} required />
        <TextInput label="Email" type="email" value={email} onChange={setEmail} required />
        <TextInput label="Password (optional)" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 8 characters" />
        <Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create staff account"}</Button>
      </form>
    </>
  );
}
