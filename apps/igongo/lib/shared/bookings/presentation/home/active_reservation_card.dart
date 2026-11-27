// The "Active Reservation" card under the hero: the guest's next stay with its
// code and status, and three action buttons. With no upcoming stay it invites a
// room booking instead. Digital Key and Manage have no screen of their own yet,
// so they open My bookings (placeholder).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/card/soft_card.dart';
import '../../../ui/photo/guest_photos.dart';
import '../../../ui/photo/photo_slot.dart';
import '../../domain/booking.dart';
import '../../domain/booking_status_label.dart';
import 'booking_status_chip.dart';

/// The active reservation card. [stay] is null when there is no upcoming stay.
class ActiveReservationCard extends StatelessWidget {
  /// Creates the card; [onDigitalKey], [onRoomOrder], [onManage] and [onBook] open the matching screens.
  const ActiveReservationCard({
    super.key,
    required this.stay,
    required this.onDigitalKey,
    required this.onRoomOrder,
    required this.onManage,
    required this.onBook,
  });

  /// The guest's next stay, if any.
  final Booking? stay;

  /// Opens the digital key (placeholder: My bookings).
  final VoidCallback onDigitalKey;

  /// Opens food ordering for the room.
  final VoidCallback onRoomOrder;

  /// Opens the stay to manage it (placeholder: My bookings).
  final VoidCallback onManage;

  /// Opens the room booking screen when there is no stay.
  final VoidCallback onBook;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final s = stay;
    return SoftCard(
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the label and, when there is a stay, its code and status.
          Row(
            children: [
              Icon(Icons.workspace_premium_outlined, size: 18, color: p.accent),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(
                child: Text(
                  'ACTIVE RESERVATION',
                  style: context.text.labelMedium?.copyWith(color: p.accent, letterSpacing: 0.6),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (s != null)
                BookingStatusChip(label: '${bookingStatusLabel(s.status)} • ${s.code}'),
            ],
          ),
          if (s == null)
            // Step 2a: no upcoming stay, so invite a booking.
            Text('No upcoming stay yet.', style: context.text.bodyMedium?.copyWith(color: p.textMuted))
          else
            // Step 2b: the room picture, the room name and the dates.
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(IgongoRadius.md),
                  child: const PhotoSlot(width: 84, height: 84, asset: GuestPhotos.roomDeluxe, icon: Icons.bed_outlined),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: IgongoSpace.xs,
                    children: [
                      Text(
                        s.offeringName,
                        style: context.text.headlineSmall?.copyWith(color: p.primaryText),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(s.when, style: context.text.bodySmall?.copyWith(color: p.textMuted), maxLines: 2),
                    ],
                  ),
                ),
              ],
            ),
          // Step 3: the three action buttons (or the booking button with no stay).
          if (s == null)
            FilledButton(onPressed: onBook, child: const Text('Book a room'))
          else
            Row(
              spacing: IgongoSpace.sm,
              children: [
                Expanded(child: _action(context, Icons.key_outlined, 'Digital Key', onDigitalKey, filled: true)),
                Expanded(child: _action(context, Icons.room_service_outlined, 'Room Order', onRoomOrder)),
                Expanded(child: _action(context, Icons.tune_outlined, 'Manage', onManage)),
              ],
            ),
        ],
      ),
    );
  }

  /// One action button: [filled] is the red primary; the others are soft.
  Widget _action(BuildContext context, IconData icon, String label, VoidCallback onTap, {bool filled = false}) {
    final p = context.palette;
    final style = ButtonStyle(
      minimumSize: const WidgetStatePropertyAll(Size(0, IgongoTouch.minimum)),
      padding: const WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: IgongoSpace.xs)),
      shape: WidgetStatePropertyAll(RoundedRectangleBorder(borderRadius: BorderRadius.circular(IgongoRadius.md))),
      backgroundColor: WidgetStatePropertyAll(filled ? p.primary : p.surfaceAlt),
      foregroundColor: WidgetStatePropertyAll(filled ? p.onPrimary : p.text),
    );
    return FilledButton.icon(
      onPressed: onTap,
      style: style,
      icon: Icon(icon, size: 18),
      // The label shrinks instead of overflowing on narrow phones or large text.
      label: FittedBox(fit: BoxFit.scaleDown, child: Text(label, maxLines: 1)),
    );
  }
}
