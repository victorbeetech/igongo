"use client";
// S03-01 Layout editor, S03-02 Tile library, S03-03 Tile settings, S03-04
// Screen order, S03-05 Device layouts and S03-08 Layout preview: pick a role,
// order and hide its menu, choose up to five bottom tabs and its home tiles,
// and publish. Holders of the role see it on their next screen, on the app
// and the web; nothing grants access that the role's permissions do not.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { usePublishLayout, useRoleChoices, useRoleLayout } from "../data/layoutApi";
import type { RoleLayout } from "../domain/roleLayout";
import { MenuOrder } from "./parts/MenuOrder";
import { RolePicker } from "./parts/RolePicker";

export function LayoutEditorPage({ screen }: { screen: ScreenContext }) {
  const [roleId, setRoleId] = useState("");
  const layout = useRoleLayout(roleId);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <RolePicker value={roleId} onChange={setRoleId} />
        {roleId && <LiveData query={layout} name="This role's layout">{(l) => <Editor key={`${l.roleId}-${l.version}`} initial={l} />}</LiveData>}
      </div>
    </>
  );
}

/** Every module key, the layout's order first. */
const fullOrder = (menu: string[]) => [...menu, ...catalog.modules.filter((m) => m.code !== "00" && !menu.includes(m.slug)).map((m) => m.slug)];

/** Lines of text as a list, without blanks. */
const lines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);

function Editor({ initial }: { initial: RoleLayout }) {
  const publish = usePublishLayout(initial.roleId);
  const role = useRoleChoices().data?.items.find((r) => r.id === initial.roleId);
  const [order, setOrder] = useState(fullOrder(initial.menu));
  const [hidden, setHidden] = useState(initial.hidden);
  const [tabs, setTabs] = useState(initial.tabs.join(", "));
  const [tiles, setTiles] = useState(initial.tiles.join("\n"));
  const tabList = tabs.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean);
  const badTab = tabList.find((t) => !catalog.screen(t));
  const save = () => publish.mutate({ menu: order, hidden, tabs: tabList, tiles: lines(tiles) });
  return (
    <>
      <p className="text-caption text-muted">Version {initial.version}{initial.updatedAt ? `, published ${new Date(initial.updatedAt).toLocaleString("en-UG")}` : ", not changed yet"}.</p>
      <SectionHeader title="Menu" />
      <MenuOrder order={order} hidden={hidden} onChange={(o, h) => { setOrder(o); setHidden(h); }} />
      <SectionHeader title="Bottom tabs and home tiles" />
      <TextInput label="Bottom tabs (up to five screen numbers, such as S71-03, S71-04)" value={tabs} onChange={setTabs} hint={badTab ? `${badTab} is not a screen number.` : "Home and Me are always there."} />
      <TextArea label={`Home tiles (one per line; empty uses the role's pre-made tiles${role ? `: ${role.homeTiles.join(", ")}` : ""})`} value={tiles} onChange={setTiles} rows={6} />
      <div>
        <Button onClick={save} disabled={publish.isPending || !!badTab || tabList.length > 5}>Publish layout</Button>
      </div>
    </>
  );
}
