// A month calendar for picking days. Past days are greyed out and cannot be
// picked. The days between a picked check-in and check-out are shaded, and
// the two ends are filled in the brand red.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/day_label.dart';
import '../../format/day_key.dart';
import '../../theme/theme.dart';
import '../domain/calendar_month.dart';

/// Sunday-first weekday labels for the calendar's top row.
const _weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/// A month grid that shows [selectedFrom] to [selectedTo] and reports each day tapped.
class CalendarMonthView extends StatefulWidget {
  /// Creates the calendar. [today] defaults to the phone's clock.
  const CalendarMonthView({
    super.key,
    required this.onPick,
    this.selectedFrom,
    this.selectedTo,
    this.today,
    this.initialMonth,
  });

  /// Called with the day the guest tapped (never a past day).
  final void Function(DateTime day) onPick;

  /// The first picked day, shaded and filled.
  final DateTime? selectedFrom;

  /// The last picked day (check-out), shaded and filled.
  final DateTime? selectedTo;

  /// Today, for greying out past days; defaults to now.
  final DateTime? today;

  /// The month to open on; defaults to the picked day's month, or this month.
  final DateTime? initialMonth;

  @override
  State<CalendarMonthView> createState() => _CalendarMonthViewState();
}

class _CalendarMonthViewState extends State<CalendarMonthView> {
  /// The month on screen (its first day).
  late DateTime _month;

  @override
  void initState() {
    super.initState();
    // Step 1: open on the given month, else on the picked day's month, else this month.
    final start = widget.initialMonth ?? widget.selectedFrom ?? widget.today ?? DateTime.now();
    _month = DateTime(start.year, start.month);
  }

  /// Moves the grid by [months] (negative goes back).
  void _shift(int months) => setState(() => _month = DateTime(_month.year, _month.month + months));

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    final today = widget.today ?? DateTime.now();
    final cells = monthCells(_month);
    return Column(
      children: [
        // Step 1: the heading with the month and the arrows to move it.
        Row(
          children: [
            IconButton(tooltip: 'Previous month', icon: const Icon(Icons.chevron_left), onPressed: () => _shift(-1)),
            Expanded(child: Text(monthTitle(_month), textAlign: TextAlign.center, style: t.titleMedium)),
            IconButton(tooltip: 'Next month', icon: const Icon(Icons.chevron_right), onPressed: () => _shift(1)),
          ],
        ),
        // Step 2: the weekday names.
        Row(
          children: [
            for (final w in _weekLabels)
              Expanded(
                child: Text(w, textAlign: TextAlign.center, style: t.labelMedium?.copyWith(color: p.textMuted)),
              ),
          ],
        ),
        // Step 3: one row per week, seven cells a row; blank cells keep the columns lined up.
        for (var row = 0; row < cells.length; row += 7)
          Row(
            children: [
              for (final day in cells.sublist(row, row + 7))
                Expanded(
                  child: day == null
                      ? const SizedBox(height: IgongoTouch.minimum)
                      : _DayCell(
                          day: day,
                          disabled: isPastDay(day, today),
                          isEdge: _isEdge(day),
                          inRange: _inRange(day),
                          onTap: () => widget.onPick(day),
                        ),
                ),
            ],
          ),
      ],
    );
  }

  /// True for the picked first or last day.
  bool _isEdge(DateTime day) {
    final from = widget.selectedFrom;
    final to = widget.selectedTo;
    return (from != null && dayKey(from) == dayKey(day)) || (to != null && dayKey(to) == dayKey(day));
  }

  /// True for a day strictly between the picked first and last day.
  bool _inRange(DateTime day) {
    final from = widget.selectedFrom;
    final to = widget.selectedTo;
    if (from == null || to == null) return false;
    return day.isAfter(dayOnly(from)) && day.isBefore(dayOnly(to));
  }
}

/// One day in the grid: a circle, filled when picked, shaded when between the picked days.
class _DayCell extends StatelessWidget {
  /// Creates the cell for [day].
  const _DayCell({
    required this.day,
    required this.disabled,
    required this.isEdge,
    required this.inRange,
    required this.onTap,
  });

  /// The date.
  final DateTime day;

  /// True for a day that cannot be picked.
  final bool disabled;

  /// True for a picked end day.
  final bool isEdge;

  /// True for a day between the picked ends.
  final bool inRange;

  /// Called when the day is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the fill and the ink for this day's state.
    final fill = isEdge ? p.primary : (inRange ? p.primaryContainer : null);
    final ink = isEdge ? p.onPrimary : (disabled ? p.textMuted : p.text);
    return InkWell(
      customBorder: const CircleBorder(),
      onTap: disabled ? null : onTap,
      child: Container(
        height: IgongoTouch.minimum,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: fill, shape: BoxShape.circle),
        child: Text('${day.day}', style: context.text.bodyLarge?.copyWith(color: ink)),
      ),
    );
  }
}
