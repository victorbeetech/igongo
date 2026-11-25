// Showcase: text fields, the search field and the switch.

import { Field } from "@/shared/ui/field/Field";
import { OptionSwitch } from "@/shared/screens/settings/OptionSwitch";
import { SearchField } from "@/shared/ui/search/SearchField";
import { ShowcaseSection } from "../ShowcaseSection";

/** Every kind of input, with sample hints. */
export function FieldSection() {
  return (
    <ShowcaseSection title="Fields and controls">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name" hint="Tumusiime Ronald" />
        <Field label="Password" hint="At least 10 characters" type="password" />
      </div>
      <SearchField hint="Search staff" />
      <div className="rounded-md border border-line bg-surface">
        <OptionSwitch label="Comments on" hint="Staff can comment on posts" initial />
        <OptionSwitch label="Likes only" hint="Off until the super admin turns it on" initial={false} />
      </div>
    </ShowcaseSection>
  );
}
