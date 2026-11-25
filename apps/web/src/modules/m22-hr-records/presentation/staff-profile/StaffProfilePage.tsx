"use client";
// S22-02 Staff profile (and S22-08 My profile at work): one person's work
// details. HR can edit them and mark the person suspended or left. Their
// card and attendance are one click away.

import { useStaffMember, useMyProfile, useUpdateStaff, type StaffMember } from "@/modules/m22-hr-records/data/staffApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { StaffForm } from "../add-staff/StaffForm";

/** S22-02: the profile in the address, editable by HR. */
export function StaffProfilePage({ screen }: { screen: ScreenContext }) {
  const staff = useStaffMember(recordIdOf(useAddress().path));
  return <LiveData query={staff} name={screen.spec.name}>{(s) => <Profile member={s} editable />}</LiveData>;
}

/** S22-08: my own profile, read only. */
export function MyProfilePage({ screen }: { screen: ScreenContext }) {
  const me = useMyProfile();
  return <LiveData query={me} name={screen.spec.name}>{(s) => <Profile member={s} editable={false} />}</LiveData>;
}

/** The loaded profile. */
function Profile({ member: s, editable }: { member: StaffMember; editable: boolean }) {
  const update = useUpdateStaff(s.staffId);
  const facts: [string, string | null][] = [["Staff number", s.staffNumber], ["Department", s.department], ["Job title", s.jobTitle], ["Phone", s.phone], ["Email", s.email], ["First working day", s.hireDate], ["Emergency contact", s.emergencyContact]];
  return (
    <div className="grid gap-4 p-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-title font-bold">{s.name}</h2>
          <StatusChip status={s.status[0]!.toUpperCase() + s.status.slice(1)} />
        </div>
        <dl className="mt-2 grid gap-1 text-body sm:grid-cols-2">
          {facts.map(([k, v]) => <div key={k}><dt className="text-caption text-muted">{k}</dt><dd>{v ?? "Not given"}</dd></div>)}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" href={catalog.hrefOf(catalog.screen("S16-08")!)}>Cards</Button>
          <Button variant="secondary" href={catalog.hrefOf(catalog.screen("S25-04")!)}>Attendance today</Button>
          {editable && s.status === "active" && <Button variant="danger" onClick={() => update.mutate({ status: "suspended" })}>Suspend</Button>}
          {editable && s.status !== "active" && <Button variant="secondary" onClick={() => update.mutate({ status: "active" })}>Make active</Button>}
          {editable && s.status !== "left" && <Button variant="secondary" onClick={() => update.mutate({ status: "left" })}>Mark as left</Button>}
        </div>
      </Card>
      {editable && (
        <section className="grid gap-2">
          <SectionHeader title="Edit details" />
          <StaffForm key={s.updatedAt} initial={s} action="Save changes" busy={update.isPending} onSave={(d) => update.mutate(d)} />
        </section>
      )}
    </div>
  );
}
