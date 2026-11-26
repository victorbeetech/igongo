// S00-21 Role home on the web: built from the person's role at run time. The
// tiles come from the role (the super admin edits them in the layout editor).

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { TileGrid } from "@/shared/screens/home/TileGrid";
import { iconFor } from "@/shared/ui/icons/moduleIcons";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { Logo } from "@/shared/ui/logo/Logo";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { HomeTile } from "@/shared/ui/tile/HomeTile";
import { STAFF_SHORTCUTS } from "./roleShortcuts";

/** The role home. */
export function RoleHomePage({ screen }: { screen: ScreenContext }) {
  const { role } = screen;
  const here = catalog.hrefOf(screen.spec);
  return (
    <>
      {/* Step 1: the greeting on Igongo red, the same in light and dark mode. */}
      <div className="m-4 flex items-center gap-3 rounded-md bg-primary p-4 text-on-primary">
        <Logo height={44} onRed />
        <div className="flex-1">
          <div className="text-title font-bold">Good morning, Grace</div>
          <div className="text-caption opacity-85">{role.name}</div>
        </div>
      </div>
      {/* Step 2: the role's tiles, with a sample count on every other tile. */}
      <SectionHeader title="Today" />
      <div className="px-4">
        <TileGrid>
          {role.tiles.map(([label, id], i) => {
            const Icon = iconFor(id!);
            return <HomeTile key={label} label={label!} icon={<Icon size={20} />} count={i % 2 === 0 ? String(((i * 3 + 2) % 9) + 1) : undefined} href={hrefFor(id!, here)} />;
          })}
        </TileGrid>
      </div>
      {/* Step 3: the staff shortcuts; guests see the client app instead. */}
      {role.level !== "Guests and clients" && (
        <>
          <SectionHeader title="Shortcuts" />
          <div className="mx-4 rounded-md border border-line bg-surface">
            {STAFF_SHORTCUTS.map((s) => {
              const Icon = iconFor(s.targetId);
              return <ListRow key={s.label} title={s.label} leading={<Icon size={18} />} href={hrefFor(s.targetId, here)} />;
            })}
          </div>
        </>
      )}
    </>
  );
}
