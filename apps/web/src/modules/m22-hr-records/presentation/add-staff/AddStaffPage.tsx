"use client";
// S22-03 Add staff: HR enrols a new staff member. They get the next staff
// number; when an account ID is given it is linked and gets the base staff
// role. Then the profile opens, where a card can be issued.

import { useEnrolStaff } from "@/modules/m22-hr-records/data/staffApi";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffForm } from "./StaffForm";

/** The add staff page. */
export function AddStaffPage({ screen }: { screen: ScreenContext }) {
  const address = useAddress();
  const enrol = useEnrolStaff();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <StaffForm action="Enrol staff member" busy={enrol.isPending} onSave={(d) => enrol.mutate(d, { onSuccess: (s) => address.push(recordHref(catalog.screen("S22-02")!, s.staffId)) })} />
      </div>
    </>
  );
}
