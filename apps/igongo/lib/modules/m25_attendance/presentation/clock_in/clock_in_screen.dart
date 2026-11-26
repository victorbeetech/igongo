// S25-01 Clock in (and S25-02 Clock-in result), live:
// - every staff member: am I in or out, and a button to clock myself in or
//   out from the phone (when the rules allow it);
// - gate, reception and security phones (permission attendance.station.create):
//   "station mode", where each card tapped on the phone clocks its holder.
// Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/attendance_providers.dart';
import '../../domain/attendance_status.dart';
import 'station_panel.dart';
import 'time_text.dart';

/// The clock-in screen.
class ClockInScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const ClockInScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<AttendanceStatus>(
    screenName: screen.spec.name,
    value: ref.watch(attendanceStatusProvider),
    onRetry: () => ref.invalidate(attendanceStatusProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, status, session) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: in or out now, and the clock button.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: IgongoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                Text(status.staff.name, style: context.text.titleMedium),
                Text(status.staff.line, style: context.text.bodySmall),
                StatusChip(status.clockedIn ? 'On site' : 'Clocked out'),
                if (status.last != null)
                  Text(
                    'Last: ${status.last!.isIn ? 'in' : 'out'} at ${timeText(status.last!.at)}, ${status.last!.station}',
                  ),
                if (status.today != null)
                  Text('Today: ${status.today!.hours} on site${status.today!.late ? ', late' : ''}'),
                if (status.allowAppClock)
                  IgongoButton(
                    label: status.clockedIn ? 'Clock me out' : 'Clock me in',
                    icon: Icons.fingerprint,
                    expand: true,
                    onPressed: () => _clockSelf(context, ref),
                  )
                else
                  Text('Clock in at the gate or reception with your card.', style: context.text.bodySmall),
              ],
            ),
          ),
        ),
        // Step 2: station mode, for the gate, reception and security.
        ...[
          if ((session?.can('attendance.station.create') ?? false)) const SectionHeader('Station mode'),
          if ((session?.can('attendance.station.create') ?? false)) const StationPanel(),
        ],
      ],
    ),
  );

  /// Clocks the person in or out, then refreshes the status.
  Future<void> _clockSelf(BuildContext context, WidgetRef ref) async {
    try {
      final event = await ref.read(attendanceApiProvider).clockSelf();
      final words = 'Clocked ${event.isIn ? 'in' : 'out'} at ${timeText(event.at)}${event.late ? ' (late)' : ''}';
      if (context.mounted) showIgongoToast(context, words);
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(attendanceStatusProvider);
  }
}
