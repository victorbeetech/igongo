// The dashboard layout: four numbers, a chart and the latest records.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/chart/bar_chart.dart';
import '../../ui/kpi/kpi_card.dart';
import '../../ui/section/section_header.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/sample_rows.dart';
import '../parts/screen_list_view.dart';

/// Numbers, a chart and the latest items.
class DashboardLayout extends StatelessWidget {
  /// Creates the dashboard for [screen].
  const DashboardLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final mock = screen.module.mock;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: the numbers, two per row on phones and four on wide screens.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: LayoutBuilder(
            builder: (context, box) {
              final perRow = box.maxWidth > 600 ? 4 : 2;
              final width = (box.maxWidth - IgongoSpace.sm * (perRow - 1)) / perRow;
              return Wrap(
                spacing: IgongoSpace.sm,
                runSpacing: IgongoSpace.sm,
                children: [
                  for (final (label, value) in mock.kpis)
                    SizedBox(
                      width: width,
                      child: KpiCard(label: label, value: value),
                    ),
                ],
              );
            },
          ),
        ),
        // Step 2: the week's trend.
        const SectionHeader('This week'),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: IgongoCard(
            child: BarChart(
              values: [0.4, 0.7, 0.55, 0.9, 0.65, 0.8, 0.5],
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            ),
          ),
        ),
        // Step 3: the latest records and the screens behind the numbers.
        const SectionHeader('Latest'),
        SampleRows(mock: mock, count: 3),
        LinkRows(screen, title: 'Open'),
        DialogButtons(screen),
      ],
    );
  }
}
