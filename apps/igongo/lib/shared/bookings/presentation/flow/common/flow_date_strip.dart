// A row of day tiles (weekday, day number, month). The first tile is labelled
// "TODAY". The picked day is filled red.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'flow_dates.dart';

/// A horizontal strip of selectable days.
class FlowDateStrip extends StatelessWidget {
  /// Creates the strip for [days], with [selected] highlighted.
  const FlowDateStrip({super.key, required this.days, required this.selected, required this.onChanged});

  /// The days to show, in order.
  final List<DateTime> days;

  /// The day that is picked.
  final DateTime selected;

  /// Called with the day the guest taps.
  final ValueChanged<DateTime> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: one tile per day, in a row that can scroll on small phones.
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < days.length; i++)
            Padding(
              padding: const EdgeInsets.only(right: IgongoSpace.sm),
              child: _DayTile(
                date: days[i],
                isToday: i == 0,
                isSelected: _sameDay(days[i], selected),
                onTap: () => onChanged(days[i]),
                palette: palette,
              ),
            ),
        ],
      ),
    );
  }

  /// True when [a] and [b] fall on the same calendar day.
  static bool _sameDay(DateTime a, DateTime b) => a.year == b.year && a.month == b.month && a.day == b.day;
}

/// One day tile in the strip.
class _DayTile extends StatelessWidget {
  const _DayTile({
    required this.date,
    required this.isToday,
    required this.isSelected,
    required this.onTap,
    required this.palette,
  });

  final DateTime date;
  final bool isToday;
  final bool isSelected;
  final VoidCallback onTap;
  final IgongoPalette palette;

  @override
  Widget build(BuildContext context) {
    // Step 1: colours for the picked and unpicked states.
    final foreground = isSelected ? palette.onPrimary : palette.text;
    final muted = isSelected ? palette.onPrimary : palette.textMuted;
    return Material(
      color: isSelected ? palette.primary : palette.surface,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        onTap: onTap,
        child: Container(
          width: 64,
          padding: const EdgeInsets.symmetric(vertical: IgongoSpace.sm),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            border: Border.all(color: isSelected ? palette.primary : palette.border),
          ),
          // Step 2: the weekday (or TODAY), the day number and the month.
          child: Column(
            children: [
              Text(
                isToday ? 'TODAY' : flowWeekdayShort(date).toUpperCase(),
                style: context.text.labelSmall?.copyWith(color: muted, fontWeight: FontWeight.w700),
              ),
              Text(
                '${date.day}',
                style: context.text.titleLarge?.copyWith(color: foreground, fontWeight: FontWeight.w700),
              ),
              Text(flowMonthShort(date), style: context.text.labelSmall?.copyWith(color: muted)),
            ],
          ),
        ),
      ),
    );
  }
}
