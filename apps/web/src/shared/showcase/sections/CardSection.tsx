// Showcase: cards, number cards, home tiles, list rows, avatars and a chart.

import { Fingerprint, UtensilsCrossed } from "lucide-react";
import { InitialsAvatar } from "@/shared/ui/avatar/InitialsAvatar";
import { Card } from "@/shared/ui/card/Card";
import { BarChart } from "@/shared/ui/chart/BarChart";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { HomeTile } from "@/shared/ui/tile/HomeTile";
import { ShowcaseSection } from "../ShowcaseSection";

/** The containers pages are built from, with sample content. */
export function CardSection() {
  return (
    <ShowcaseSection title="Cards, tiles and lists">
      <Card>A plain card holds any content.</Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="On duty" value="42" />
        <KpiCard label="Late today" value="3" />
        <HomeTile label="Attendance" icon={<Fingerprint size={20} aria-hidden />} href="/design-system" />
        <HomeTile label="Orders" icon={<UtensilsCrossed size={20} aria-hidden />} count="5" href="/design-system" />
      </div>
      <Card className="p-0!">
        <ListRow title="Natukunda Esther" subtitle="Kitchen · Today 08:30" status="Approved" leading={<InitialsAvatar name="Natukunda Esther" />} href="/design-system" />
        <ListRow title="Okello James" subtitle="Pool · Yesterday 13:05" status="Pending" leading={<InitialsAvatar name="Okello James" />} href="/design-system" />
      </Card>
      <Card>
        <BarChart values={[0.4, 0.7, 0.55, 0.9, 0.65]} labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} />
      </Card>
    </ShowcaseSection>
  );
}
