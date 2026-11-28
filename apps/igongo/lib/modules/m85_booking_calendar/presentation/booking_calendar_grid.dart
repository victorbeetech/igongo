// The month grid of the booking calendar. Each day shows its number and a word
// for its status (Open, Full or nothing for closed days), so the meaning never
// depends on colour alone. Only days the calendar holds can be tapped.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/bookings/domain/calendar_month.dart';
import '../../../shared/format/day_key.dart';
import '../../../shared/format/day_label.dart';
import '../../../shared/theme/theme.dart';
import '../domain/calendar_day_status.dart';
import '../domain/calendar_view.dart';

/// Sunday-first weekday labels for the grid's top row.
const _weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/// A month of days, each with its status from [view]. Arrows move to the months either side.
class BookingCalendarGrid extends StatelessWidget {
  /// Creates the grid for [month] (any day in it) and the days in [view].
  const BookingCalendarGrid({
    super.key,
    required this.month,
    required this.view,
    required this.today,
    required this.picked,
    required this.onPick,
    required this.onPrevious,
    required this.onNext,
  });

  /// The month on screen (any day in it).
  final DateTime month;

  /// The calendar's days, which give each day's status.
  final CalendarView view;

  /// The hotel's today, so past days can be drawn as closed.
  final DateTime today;

  /// The day picked now, or null.
  final DateTime? picked;

  /// Called with the day the guest tapped.
  final ValueChanged<DateTime> onPick;

  /// Moves to the month before.
  final VoidCallback onPrevious;

  /// Moves to the month after.
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    // Step 1: the grid cells for the month, in whole weeks.
    final cells = monthCells(month);
    // Step 1a: the picked day as a local, so its key can be read without a null check on a field.
    final chosen = picked;
    return Column(
      children: [
        // Step 2: the month title with the arrows that move it.
        Row(
          children: [
            IconButton(tooltip: 'Previous month', icon: const Icon(Icons.chevron_left), onPressed: onPrevious),
            Expanded(child: Text(monthTitle(month), textAlign: TextAlign.center, style: t.titleMedium)),
            IconButton(tooltip: 'Next month', icon: const Icon(Icons.chevron_right), onPressed: onNext),
          ],
        ),
        // Step 3: the weekday names across the top.
        Row(
          children: [
            for (final w in _weekLabels)
              Expanded(child: Text(w, textAlign: TextAlign.center, style: t.labelMedium?.copyWith(color: p.textMuted))),
          ],
        ),
        // Step 4: one row per week; blank cells keep the columns in line.
        for (var row = 0; row < cells.length; row += 7)
          Row(
            children: [
              for (final day in cells.sublist(row, row + 7))
                Expanded(
                  child: day == null
                      ? const SizedBox(height: IgongoTouch.minimum)
                      : _DayCell(
                          day: day,
                          // Null when the calendar does not hold the day (past the window, for example).
                          status: view.dayFor(day)?.status,
                          isPicked: chosen != null && dayKey(chosen) == dayKey(day),
                          onTap: view.dayFor(day) == null ? null : () => onPick(day),
                        ),
                ),
            ],
          ),
      ],
    );
  }
}

/// One day in the grid: its number, and a word for its status.
class _DayCell extends StatelessWidget {
  /// Creates the cell for [day]. [status] is null when the calendar does not hold the day.
  const _DayCell({required this.day, required this.status, required this.isPicked, required this.onTap});

  /// The date this cell shows.
  final DateTime day;

  /// The day's status, or null when the calendar does not hold it.
  final CalendarDayStatus? status;

  /// True for the day the guest picked.
  final bool isPicked;

  /// Called when the day is tapped; null when the day cannot be opened.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    // Step 1: the word and its colour for this status. Closed and unknown days show no word.
    final (word, wordColour) = switch (status) {
      CalendarDayStatus.open => ('Open', p.success),
      CalendarDayStatus.spotsFull => ('Full', p.error),
      _ => ('', p.textMuted),
    };
    // Step 2: the number's ink: white on the picked day, muted for closed days, plain otherwise.
    final ink = isPicked ? p.onPrimary : (status == null || status == CalendarDayStatus.closed ? p.textMuted : p.text);
    final tappable = onTap != null;
    return Semantics(
      button: tappable,
      enabled: tappable,
      selected: isPicked,
      label: '${shortDay(day)}${word.isEmpty ? '' : ', $word'}',
      child: InkWell(
        // The whole cell is the touch target, at least the minimum touch size tall.
        borderRadius: BorderRadius.circular(IgongoTouch.minimum / 2),
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: IgongoTouch.minimum),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isPicked ? p.primary : null,
            borderRadius: BorderRadius.circular(IgongoTouch.minimum / 2),
          ),
          // Step 3: scale the text down rather than overflow at large text sizes.
          child: ExcludeSemantics(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('${day.day}', style: t.bodyLarge?.copyWith(color: ink)),
                  if (word.isNotEmpty) Text(word, style: t.labelSmall?.copyWith(color: isPicked ? p.onPrimary : wordColour)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
