// The Select Date screen: a calendar and quick picks (Today, Tomorrow, This
// week). For stays it picks check-in and then check-out; for other bookings a
// single day. Continue returns the picked days to the screen that opened it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/day_label.dart';
import '../../layout/igongo_scaffold.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../domain/booking_selection.dart';
import 'calendar_month_view.dart';

/// Picks the day (or the stay) and pops with a [BookingSelection].
class DateSelectScreen extends StatefulWidget {
  /// Creates the screen. [nights] true asks for check-in and check-out.
  const DateSelectScreen({super.key, required this.nights, this.initial, this.today});

  /// True for stays (check-in and check-out).
  final bool nights;

  /// The days picked before, shown as already chosen.
  final BookingSelection? initial;

  /// Today, for the calendar and the quick picks; defaults to now.
  final DateTime? today;

  @override
  State<DateSelectScreen> createState() => _DateSelectScreenState();
}

class _DateSelectScreenState extends State<DateSelectScreen> {
  /// The first picked day.
  DateTime? _from;

  /// The check-out day (stays only).
  DateTime? _to;

  @override
  void initState() {
    super.initState();
    // Step 1: start from the days picked before, if any.
    _from = widget.initial?.from;
    _to = widget.initial?.to;
  }

  /// Today's date with no time of day.
  DateTime get _today {
    final now = widget.today ?? DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  /// A calendar tap. For a single day it picks that day. For a stay: the first tap sets
  /// check-in, the next later day sets check-out, and a tap on or before check-in starts again.
  void _pick(DateTime day) {
    setState(() {
      if (!widget.nights) {
        _from = day;
        _to = null;
        return;
      }
      final from = _from;
      if (from == null || _to != null || !day.isAfter(from)) {
        _from = day;
        _to = null;
      } else {
        _to = day;
      }
    });
  }

  /// Sets the days from a quick pick: [from] to [to] (to is ignored for single days).
  void _quick(DateTime from, DateTime to) {
    setState(() {
      _from = from;
      _to = widget.nights ? to : null;
    });
  }

  /// True when the picks are complete: a day, or a check-in and a later check-out.
  bool get _complete => _from != null && (!widget.nights || _to != null);

  /// Pops with the picked days.
  void _continue() {
    final from = _from;
    if (from == null) return;
    Navigator.of(context).pop(BookingSelection(from: from, to: widget.nights ? _to : null));
  }

  @override
  Widget build(BuildContext context) {
    final t = _today;
    final tomorrow = t.add(const Duration(days: 1));
    final chips = [
      ('Today', t, t.add(const Duration(days: 1))),
      ('Tomorrow', tomorrow, tomorrow.add(const Duration(days: 1))),
      if (widget.nights) ('This week', t, t.add(const Duration(days: 7))),
    ];
    final from = _from;
    final to = _to;
    return IgongoScaffold(
      title: 'Select date',
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          CalendarMonthView(today: t, selectedFrom: from, selectedTo: to, initialMonth: from ?? t, onPick: _pick),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the summary of the picks, in words.
          Text(
            from == null
                ? (widget.nights ? 'Pick check-in and check-out.' : 'Pick a day.')
                : (widget.nights && to != null
                      ? 'Check-in ${shortDay(from)}, check-out ${shortDay(to)}'
                      : shortDay(from)),
            style: context.text.titleSmall,
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the quick picks.
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (final (label, a, b) in chips) ActionChip(label: Text(label), onPressed: () => _quick(a, b)),
            ],
          ),
          const SizedBox(height: IgongoSpace.xl),
          IgongoButton(label: 'Continue', expand: true, onPressed: _complete ? _continue : null),
        ],
      ),
    );
  }
}
