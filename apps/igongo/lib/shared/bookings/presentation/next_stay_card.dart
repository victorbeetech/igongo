// The "Hotel Booking" card on the Bookings home: the guest's next stay with a
// date tile, a room picture, "Tomorrow • 1 Night" and a View Booking button.
// With no upcoming stay it invites the guest to book a room instead.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/day_key.dart';
import '../../theme/theme.dart';
import '../../ui/card/soft_card.dart';
import '../../ui/photo/guest_photos.dart';
import '../../ui/photo/photo_slot.dart';
import '../domain/booking.dart';

/// The next-stay card. [stay] is null when there is no upcoming stay.
class NextStayCard extends StatelessWidget {
  /// Creates the card; [onView] opens the stay, [onBook] opens the room booking.
  const NextStayCard({super.key, required this.stay, required this.onView, required this.onBook, this.today});

  /// The guest's next stay, if any.
  final Booking? stay;

  /// Opens the stay (My bookings).
  final VoidCallback onView;

  /// Opens the room booking screen.
  final VoidCallback onBook;

  /// Today, for the tests; the clock when null.
  final DateTime? today;

  static const _months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  static const _days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  /// "Today", "Tomorrow" or the day count in words.
  static String _whenWords(DateTime day, DateTime today) {
    final gap = day.difference(dayOnly(today)).inDays;
    return gap == 0
        ? 'Today'
        : gap == 1
        ? 'Tomorrow'
        : 'In $gap days';
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final now = today ?? DateTime.now();
    final day = parseDayKey(stay?.date);
    final end = parseDayKey(stay?.endDate);
    final nights = day != null && end != null ? end.difference(day).inDays : 1;
    return SoftCard(
      padding: const EdgeInsets.all(IgongoSpace.sm),
      child: Row(
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the date tile: "TOM" (or the weekday), the day and the month.
          Container(
            width: 54,
            height: 75,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: p.surface,
              borderRadius: BorderRadius.circular(IgongoRadius.md),
              border: Border.all(color: p.border),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  day == null ? '' : (day.difference(dayOnly(now)).inDays == 1 ? 'TOM' : _days[day.weekday - 1]),
                  style: context.text.labelMedium?.copyWith(color: p.primaryText),
                ),
                Text(day == null ? '–' : '${day.day}', style: context.text.headlineSmall),
                Text(day == null ? '' : _months[day.month - 1], style: context.text.labelMedium),
              ],
            ),
          ),
          // Step 2: the room picture.
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            child: const PhotoSlot(width: 108, height: 75, asset: GuestPhotos.roomDeluxe, icon: Icons.bed_outlined),
          ),
          // Step 3: the title, when and how long, and the button.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.xs,
              children: [
                Text('Hotel Booking', style: context.text.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(
                  day == null
                      ? 'No upcoming stay'
                      : '${_whenWords(day, now)} • $nights ${nights == 1 ? 'Night' : 'Nights'}',
                  style: context.text.bodySmall?.copyWith(color: p.textMuted),
                ),
                // A red pill with the words and a double arrow, as on the reference.
                FilledButton(
                  onPressed: day == null ? onBook : onView,
                  style: FilledButton.styleFrom(shape: const StadiumBorder()),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(child: Text(day == null ? 'Book a room' : 'View Booking', overflow: TextOverflow.ellipsis)),
                      const Icon(Icons.keyboard_double_arrow_right, size: 18),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
