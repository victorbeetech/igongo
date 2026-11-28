// The title row at the top of the Bookings tab: a calendar badge with "Bookings
// & Services", then the receipts and notification buttons on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The Bookings tab header.
class BookingsHomeHeader extends StatelessWidget {
  /// Creates the header; [onReceipts] opens the receipts, [onCalendar] opens the booking calendar, and [onNotifications] is the bell.
  const BookingsHomeHeader({super.key, required this.onReceipts, this.onCalendar, this.onNotifications});

  /// Opens the receipts and invoices.
  final VoidCallback onReceipts;

  /// Opens the booking calendar when tapped; null leaves the badge as a plain picture.
  final VoidCallback? onCalendar;

  /// Opens notifications; null while no notifications screen is wired here (placeholder).
  final VoidCallback? onNotifications;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.md, IgongoSpace.sm, IgongoSpace.xs, IgongoSpace.sm),
        child: Row(
          children: [
            // Step 1: the calendar badge (it opens the booking calendar) and the title (the title may wrap on small text sizes).
            // The tap area is the touch minimum, so the small badge is still easy to hit.
            SizedBox(
              width: IgongoTouch.minimum,
              height: IgongoTouch.minimum,
              child: Tooltip(
                message: 'Booking calendar',
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: onCalendar,
                  child: Center(
                    child: CircleAvatar(
                      radius: 18,
                      backgroundColor: p.primaryContainer,
                      foregroundColor: p.primaryText,
                      child: const Icon(Icons.calendar_month_outlined, size: 20),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: IgongoSpace.sm),
            Expanded(
              child: Text(
                'Bookings & Services',
                style: context.text.headlineSmall?.copyWith(color: p.primaryText),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            // Step 2: the receipts button, then the bell (a placeholder with no action yet).
            IconButton(
              tooltip: 'Receipts and invoices',
              onPressed: onReceipts,
              icon: Icon(Icons.receipt_long_outlined, color: p.secondary),
            ),
            IconButton(
              tooltip: 'Notifications',
              onPressed: onNotifications,
              icon: Icon(Icons.notifications_none_outlined, color: p.secondary),
            ),
          ],
        ),
      ),
    );
  }
}
