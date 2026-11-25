// S25-03 My attendance, live: my last month, one row per day with in, out,
// time on site and a late mark. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/attendance_providers.dart';
import '../../domain/day_summary.dart';
import '../clock_in/time_text.dart';

/// My attendance.
class MyAttendanceScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyAttendanceScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<DaySummary>>(
    screenName: screen.spec.name,
    value: ref.watch(myDaysProvider),
    onRetry: () => ref.invalidate(myDaysProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, days, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        if (days.isEmpty) const IgongoListRow(title: 'No clock-ins yet', subtitle: 'Your days will show here.'),
        for (final d in days)
          IgongoListRow(
            title: d.workDate,
            subtitle:
                'In ${d.firstIn == null ? '—' : timeText(d.firstIn!)} · out ${d.lastOut == null ? '—' : timeText(d.lastOut!)} · ${d.hours}',
            status: d.late ? 'Late' : 'On time',
            leading: const Icon(Icons.event_available_outlined),
          ),
      ],
    ),
  );
}
