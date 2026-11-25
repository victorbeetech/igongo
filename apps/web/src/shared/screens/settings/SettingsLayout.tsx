// The settings layout: switches for the module's options and Save. Everything
// here is something the super admin sets without code.

import type { ScreenContext } from "@/shared/catalog/types";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";
import { ToastButton } from "../parts/ToastButton";
import { OptionSwitch } from "./OptionSwitch";

/** Switches and choices with a Save button. */
export function SettingsLayout({ screen }: { screen: ScreenContext }) {
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <SectionHeader title="Options" />
      <div className="mx-4 max-w-3xl rounded-md border border-line bg-surface">
        {screen.module.mock.items.slice(0, 5).map((item, i) => (
          <OptionSwitch key={item} label={item} hint={i % 2 === 0 ? "On for every role that uses it" : "Off until the super admin turns it on"} initial={i % 2 === 0} />
        ))}
      </div>
      <LinkRows screen={screen} title="More settings" />
      <DialogButtons screen={screen} />
      <div className="max-w-sm p-4">
        <ToastButton message="Changes saved">Save changes</ToastButton>
      </div>
    </>
  );
}
