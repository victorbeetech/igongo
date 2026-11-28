// The guest home editor, shown in Business settings as "Guest home". The super
// admin turns each block and each item on or off, adds, changes or removes items,
// and saves the whole section at once. The API checks every value before saving.

import { useState } from "react";
import { useSaveSection } from "@/modules/m01-super-admin/data/consoleApi";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { Button } from "@/shared/ui/button/Button";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { HomeBlock } from "./HomeBlock";
import { HOME_ICON_OPTIONS, HOME_LIMITS, NEW_ACTION, NEW_SLIDE, NEW_STORY, type HomeHeroSlide, type HomeQuickAction, type HomeSettings, type HomeStory } from "./home-content-types";

/** The editor for the whole guest home section. */
export function HomeContentEditor({ initial }: { initial: HomeSettings }) {
  // Step 1: keep a working copy; nothing reaches the API until Save.
  const [home, setHome] = useState(initial);
  const save = useSaveSection();
  return (
    <section className="grid gap-4 rounded-md border border-line bg-surface p-3">
      <SectionHeader title="Guest home" />
      <p className="text-caption text-muted">Turn each block or item on or off, and add, change or remove items. A block with no items does not show in the app.</p>

      {/* Step 2: stories, the round bubbles under the title. */}
      <HomeBlock<HomeStory>
        title="Happening today (stories)"
        enabled={home.stories.enabled}
        onEnabled={(on) => setHome({ ...home, stories: { ...home.stories, enabled: on } })}
        items={home.stories.items}
        max={HOME_LIMITS.stories}
        newItem={NEW_STORY}
        onItems={(items) => setHome({ ...home, stories: { ...home.stories, items } })}
        itemTitle={(s) => s.title}
        renderFields={(s, change) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Title" value={s.title} onChange={(v) => change({ ...s, title: v })} />
            <TextInput label="Time or short line" value={s.subtitle} onChange={(v) => change({ ...s, subtitle: v })} />
            <SelectInput label="Icon" value={s.icon} options={HOME_ICON_OPTIONS} onChange={(v) => change({ ...s, icon: v as HomeStory["icon"] })} />
            <TextInput label="Picture address (https)" value={s.imageUrl} onChange={(v) => change({ ...s, imageUrl: v })} />
          </div>
        )}
      />

      {/* Step 3: the hero carousel of featured stays. */}
      <HomeBlock<HomeHeroSlide>
        title="featured stays (hero)"
        enabled={home.hero.enabled}
        onEnabled={(on) => setHome({ ...home, hero: { ...home.hero, enabled: on } })}
        items={home.hero.slides}
        max={HOME_LIMITS.slides}
        newItem={NEW_SLIDE}
        onItems={(slides) => setHome({ ...home, hero: { ...home.hero, slides } })}
        itemTitle={(s) => s.title}
        renderFields={(s, change) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Tag (top left)" value={s.tag} onChange={(v) => change({ ...s, tag: v })} />
            <TextInput label="Line above the title" value={s.eyebrow} onChange={(v) => change({ ...s, eyebrow: v })} />
            <TextInput label="Title" value={s.title} onChange={(v) => change({ ...s, title: v })} />
            <TextInput label="Description" value={s.description} onChange={(v) => change({ ...s, description: v })} />
            <TextInput label="Price line" value={s.price} onChange={(v) => change({ ...s, price: v })} />
            <TextInput label="Picture address (https)" value={s.imageUrl} onChange={(v) => change({ ...s, imageUrl: v })} />
          </div>
        )}
      />

      {/* Step 4: the quick-action cards under the hero. */}
      <HomeBlock<HomeQuickAction>
        title="quick actions"
        enabled={home.quickActions.enabled}
        onEnabled={(on) => setHome({ ...home, quickActions: { ...home.quickActions, enabled: on } })}
        items={home.quickActions.items}
        max={HOME_LIMITS.quickActions}
        newItem={NEW_ACTION}
        onItems={(items) => setHome({ ...home, quickActions: { ...home.quickActions, items } })}
        itemTitle={(a) => a.title}
        renderFields={(a, change) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Title" value={a.title} onChange={(v) => change({ ...a, title: v })} />
            <TextInput label="Subtitle" value={a.subtitle} onChange={(v) => change({ ...a, subtitle: v })} />
            <SelectInput label="Icon" value={a.icon} options={HOME_ICON_OPTIONS} onChange={(v) => change({ ...a, icon: v as HomeQuickAction["icon"] })} />
            <TextInput label="Screen ID (such as S67-01, blank for coming soon)" value={a.screenId} onChange={(v) => change({ ...a, screenId: v.trim() })} />
          </div>
        )}
      />

      {/* Step 5: the dish row reads the menu, so only its switch is here; the floating WhatsApp button is switched here too. */}
      <SwitchRow label="Show From our kitchen (dishes from the menu)" on={home.restaurant.enabled} onChange={(on) => setHome({ ...home, restaurant: { enabled: on } })} />
      <SwitchRow label="Show the floating WhatsApp button" hint="The number is set under Hotel profile." on={home.whatsappButton.enabled} onChange={(on) => setHome({ ...home, whatsappButton: { enabled: on } })} />

      {/* Step 6: one Save for the whole section. */}
      <Button onClick={() => save.mutate({ section: "home", values: home })} disabled={save.isPending}>Save guest home</Button>
    </section>
  );
}
