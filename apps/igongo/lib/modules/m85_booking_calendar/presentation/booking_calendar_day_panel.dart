// The panel under the grid for the picked day: its status in words, and each
// room sold that day with the units still free. Guests see counts only, never
// names.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/day_label.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/list_row/igongo_list_row.dart';
import '../domain/calendar_day.dart';
import '../domain/calendar_day_status.dart';
import '../domain/calendar_room.dart';

/// The picked day: its date, what its status means, and its rooms.
class BookingCalendarDayPanel extends StatelessWidget {
  /// Creates the panel for [day].
  const BookingCalendarDayPanel({super.key, required this.day});

  /// The day the guest picked.
  final CalendarDay day;

  @override
  Widget build(BuildContext context) {
    final t = context.text;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Step 1: the date, then what the status means in plain words.
        Padding(
          padding: const EdgeInsets.fromLTRB(IgongoSpace.md, IgongoSpace.lg, IgongoSpace.md, IgongoSpace.xs),
          child: Text(shortDay(day.date), style: t.titleMedium),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
          child: Text(_statusWords(day.status), style: t.bodyMedium),
        ),
        // Step 2: each room sold that day, or a line when none are.
        if (day.rooms.isEmpty)
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Text('No rooms are on sale for this day.', style: t.bodyMedium),
          ),
        for (final room in day.rooms) IgongoListRow(title: room.name, subtitle: _unitsWords(room)),
      ],
    );
  }

  /// The status in plain words for a guest.
  String _statusWords(CalendarDayStatus status) => switch (status) {
    CalendarDayStatus.open => 'Open for booking.',
    CalendarDayStatus.spotsFull => 'Spots full. No more rooms are left on this day.',
    CalendarDayStatus.closed => 'Closed for booking on this day.',
  };

  /// How many units are left in a room, in words: a number, "Full", or "Available" when there is no limit.
  String _unitsWords(CalendarRoom room) {
    final left = room.left;
    if (left == null) return 'Available';
    if (left <= 0) return 'Full';
    return left == 1 ? '1 left' : '$left left';
  }
}
