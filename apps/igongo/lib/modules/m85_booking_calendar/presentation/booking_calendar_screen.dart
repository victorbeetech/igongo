// S85-01 Booking calendar (guest, live): a month of days, each Open, Spots
// full or Closed, and the rooms for the day tapped. Availability only. While
// the super admin has the calendar off, guests see a short notice instead.
// Loading, error and offline states each have their own message.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/format/hotel_day.dart' show hotelDay;
import '../../../shared/layout/igongo_scaffold.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/message/state_message.dart';
import '../application/booking_calendar_providers.dart';
import '../domain/calendar_day_status.dart';
import '../domain/calendar_view.dart';
import 'booking_calendar_day_panel.dart';
import 'booking_calendar_grid.dart';
import 'booking_calendar_legend.dart';

/// The guest's booking calendar. It has no inputs; it always shows the hotel's calendar.
class BookingCalendarScreen extends ConsumerStatefulWidget {
  /// Creates the screen.
  const BookingCalendarScreen({super.key});

  @override
  ConsumerState<BookingCalendarScreen> createState() => _BookingCalendarScreenState();
}

/// The screen's state: the month on screen and the day picked.
class _BookingCalendarScreenState extends ConsumerState<BookingCalendarScreen> {
  /// The hotel's today, taken once when the screen opens.
  late final DateTime _today;

  /// The month on screen (its first day).
  late DateTime _month;

  /// The day the guest tapped, or null.
  DateTime? _picked;

  @override
  void initState() {
    super.initState();
    // Step 1: open on the hotel's current month.
    _today = hotelDay();
    _month = DateTime(_today.year, _today.month);
  }

  /// Moves the grid by [months] (negative goes back) and clears the picked day.
  void _shift(int months) => setState(() {
    _month = DateTime(_month.year, _month.month + months);
    _picked = null;
  });

  @override
  Widget build(BuildContext context) {
    final calendar = ref.watch(bookingCalendarMonthProvider(_month));
    return IgongoScaffold(
      title: 'Booking calendar',
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(bookingCalendarMonthProvider(_month).future),
        child: ScreenListView(
          children: [
            // Step 2: the month is loading, failed, switched off, or loaded.
            calendar.when(
              loading: () => const Padding(
                padding: EdgeInsets.all(IgongoSpace.lg),
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (error, _) => _ErrorNotice(
                error: error,
                onRetry: () => ref.invalidate(bookingCalendarMonthProvider(_month)),
              ),
              data: (view) => view.enabled
                  ? _CalendarBody(
                      view: view,
                      month: _month,
                      today: _today,
                      picked: _picked,
                      onPick: (day) => setState(() => _picked = day),
                      onPrevious: () => _shift(-1),
                      onNext: () => _shift(1),
                    )
                  : const StateMessage(
                      icon: Icons.event_busy_outlined,
                      title: 'Booking calendar is not open',
                      message: 'The calendar is not shown right now. Please check again later.',
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

/// The loaded month: the grid, the legend and the picked day's panel.
class _CalendarBody extends StatelessWidget {
  /// Creates the body for a loaded, enabled [view].
  const _CalendarBody({
    required this.view,
    required this.month,
    required this.today,
    required this.picked,
    required this.onPick,
    required this.onPrevious,
    required this.onNext,
  });

  /// The loaded calendar.
  final CalendarView view;

  /// The month on screen.
  final DateTime month;

  /// The hotel's today.
  final DateTime today;

  /// The day picked, or null.
  final DateTime? picked;

  /// Called when a day is tapped.
  final ValueChanged<DateTime> onPick;

  /// Moves to the month before.
  final VoidCallback onPrevious;

  /// Moves to the month after.
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    // Step 1: the picked day's data, if the calendar holds that day.
    final chosen = picked;
    final pickedDay = chosen == null ? null : view.dayFor(chosen);
    // Step 2: say so plainly when nothing in this month can be booked.
    final anyBookable = view.days.any((d) => d.status != CalendarDayStatus.closed);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.md),
          child: BookingCalendarGrid(
            month: month,
            view: view,
            today: today,
            picked: picked,
            onPick: onPick,
            onPrevious: onPrevious,
            onNext: onNext,
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: IgongoSpace.md),
          child: BookingCalendarLegend(),
        ),
        if (!anyBookable)
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Text('No dates are open to book this month.', style: context.text.bodyMedium),
          ),
        if (pickedDay != null) BookingCalendarDayPanel(day: pickedDay),
      ],
    );
  }
}

/// The message for a failed load: the API's own words for offline, or a plain line, with a retry.
class _ErrorNotice extends StatelessWidget {
  /// Creates the notice for [error].
  const _ErrorNotice({required this.error, required this.onRetry});

  /// What went wrong.
  final Object error;

  /// Asks for the month again.
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    // Step 1: an API refusal (including offline) shows its own message; anything else gets a plain line.
    final cause = error;
    final message = cause is ApiException ? cause.message : 'Check your connection and try again.';
    return StateMessage(
      icon: Icons.cloud_off_outlined,
      title: "The calendar couldn't be loaded",
      message: message,
      actions: [TextButton(onPressed: onRetry, child: const Text('Try again'))],
    );
  }
}
