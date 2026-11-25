// Showcase: cards, number cards, home tiles, list rows, avatars and a chart.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../../../shared/ui/avatar/initials_avatar.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/chart/bar_chart.dart';
import '../../../shared/ui/kpi/kpi_card.dart';
import '../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../shared/ui/tile/home_tile.dart';
import '../showcase_section.dart';

/// The containers screens are built from, with sample content.
class CardSection extends StatelessWidget {
  /// Creates the section.
  const CardSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ShowcaseSection(
      title: 'Cards, tiles and lists',
      children: [
        IgongoCard(child: Text('A plain card holds any content.', style: context.text.bodyMedium)),
        const Row(
          spacing: IgongoSpace.sm,
          children: [
            Expanded(
              child: KpiCard(label: 'On duty', value: '42'),
            ),
            Expanded(
              child: KpiCard(label: 'Late today', value: '3'),
            ),
          ],
        ),
        Row(
          spacing: IgongoSpace.sm,
          children: [
            Expanded(
              child: HomeTile(label: 'Attendance', icon: Icons.fingerprint, onTap: () {}),
            ),
            Expanded(
              child: HomeTile(label: 'Orders', icon: Icons.restaurant_menu, count: '5', onTap: () {}),
            ),
          ],
        ),
        IgongoCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              IgongoListRow(
                title: 'Natukunda Esther',
                subtitle: 'Kitchen · Today 08:30',
                status: 'Approved',
                leading: const InitialsAvatar(name: 'Natukunda Esther'),
                onTap: () {},
              ),
              const Divider(),
              IgongoListRow(
                title: 'Okello James',
                subtitle: 'Pool · Yesterday 13:05',
                status: 'Pending',
                leading: const InitialsAvatar(name: 'Okello James'),
                onTap: () {},
              ),
            ],
          ),
        ),
        const IgongoCard(
          child: BarChart(values: [0.4, 0.7, 0.55, 0.9, 0.65], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
        ),
      ],
    );
  }
}
