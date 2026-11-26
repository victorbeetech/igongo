// Several areas' numbers, one section each; an area that could not answer
// shows a note. Used by the dashboard and by saved report runs.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/kpi/kpi_card.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../domain/dashboard_group.dart';

/// The widgets for [groups], to put in a list.
List<Widget> kpiGroups(List<DashboardGroup> groups) => [
  for (final g in groups) ...[
    SectionHeader(g.title),
    Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: g.failed
          ? const Text('These numbers could not be read just now.')
          : Wrap(
              spacing: IgongoSpace.sm,
              runSpacing: IgongoSpace.sm,
              children: [
                for (final k in g.kpis)
                  SizedBox(
                    width: 160,
                    child: KpiCard(label: k.label, value: k.shown),
                  ),
              ],
            ),
    ),
  ],
];
