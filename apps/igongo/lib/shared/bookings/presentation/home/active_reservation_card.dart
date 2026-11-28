// The "Active Reservation" card under the hero, shown only when the guest has a
// room reserved. Top row: a gold star, the label and the status pill. Then the
// room photo, the room name (brand serif), the dates and the guests line. At the
// bottom, action buttons: a room stay gets Digital Key, Room Order and Manage; an
// event booking gets Event details, Venue and My booking (no room buttons). With no
// stay, the home shows the WhatsApp card instead (book_on_whatsapp_card.dart).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/card/soft_card.dart';
import '../../../ui/photo/guest_photos.dart';
import '../../../ui/photo/photo_slot.dart';
import '../../domain/booking.dart';
import '../../domain/booking_status_label.dart';
import '../../domain/placeholder_copy.dart';
import 'booking_status_chip.dart';

/// The active reservation card for the guest's next stay.
class ActiveReservationCard extends StatelessWidget {
  /// Creates the card for [stay]. [isRoomStay] picks the buttons: true for a room
  /// (digital key, room order, manage), false for an event (details, venue, booking).
  const ActiveReservationCard({
    super.key,
    required this.stay,
    required this.isRoomStay,
    required this.onDigitalKey,
    required this.onRoomOrder,
    required this.onManage,
    required this.onEventDetails,
    required this.onVenue,
  });

  /// The guest's next stay.
  final Booking stay;

  /// True when the stay is a room (shows the room buttons); false for an event booking.
  final bool isRoomStay;

  /// Opens the digital key (placeholder: My bookings).
  final VoidCallback onDigitalKey;

  /// Opens food ordering for the room.
  final VoidCallback onRoomOrder;

  /// Opens the stay to manage it (placeholder: My bookings).
  final VoidCallback onManage;

  /// Opens the event's details (placeholder: My bookings).
  final VoidCallback onEventDetails;

  /// Opens the venue for the event (placeholder: the events screen).
  final VoidCallback onVenue;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final s = stay;
    return SoftCard(
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the gold star and label, then the status pill with the code.
          Row(
            spacing: IgongoSpace.xs,
            children: [
              Icon(Icons.star_rounded, size: 16, color: p.accent),
              Expanded(
                child: Text(
                  'ACTIVE RESERVATION',
                  style: context.text.labelMedium?.copyWith(color: p.accent, letterSpacing: 0.6),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              BookingStatusChip(label: '${bookingStatusLabel(s.status)} • ${s.code}'),
            ],
          ),
          // Step 2: the room photo on the left; the name, dates and guests on the right.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.md,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(IgongoRadius.md),
                child: const PhotoSlot(width: 96, height: 96, asset: GuestPhotos.roomDeluxe, icon: Icons.bed_outlined),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    // The room name uses the brand serif (Cinzel) at the headline size.
                    Text(
                      s.offeringName,
                      style: context.text.displaySmall?.copyWith(fontSize: IgongoType.headline.size, color: p.text),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    // The calendar line: dates from the booking.
                    Row(
                      spacing: IgongoSpace.xs,
                      children: [
                        Icon(Icons.calendar_today_outlined, size: 14, color: p.textMuted),
                        Expanded(
                          child: Text(
                            s.when,
                            style: context.text.bodySmall?.copyWith(color: p.textMuted),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    // The guests and view line, in the red accent (placeholder until the API sends it).
                    Text(
                      stayGuestsPlaceholder,
                      style: context.text.labelMedium?.copyWith(color: p.primaryText),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          // Step 3: the action buttons for this kind of stay; the first one is the filled red primary.
          Row(
            spacing: IgongoSpace.sm,
            children: isRoomStay
                ? [
                    Expanded(child: _action(context, Icons.key_outlined, 'Digital Key', onDigitalKey, filled: true)),
                    Expanded(child: _action(context, Icons.bed_outlined, 'Room Order', onRoomOrder)),
                    Expanded(child: _action(context, Icons.tune_outlined, 'Manage', onManage)),
                  ]
                : [
                    Expanded(child: _action(context, Icons.event_outlined, 'Event details', onEventDetails, filled: true)),
                    Expanded(child: _action(context, Icons.place_outlined, 'Venue', onVenue)),
                    Expanded(child: _action(context, Icons.receipt_long_outlined, 'My booking', onManage)),
                  ],
          ),
        ],
      ),
    );
  }

  /// One action button: [filled] is the red primary; the others are outlined.
  Widget _action(BuildContext context, IconData icon, String label, VoidCallback onTap, {bool filled = false}) {
    final p = context.palette;
    final shape = WidgetStatePropertyAll(
      RoundedRectangleBorder(borderRadius: BorderRadius.circular(IgongoRadius.md)),
    );
    const minSize = WidgetStatePropertyAll(Size(0, IgongoTouch.minimum));
    const padding = WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: IgongoSpace.xs));
    // The label shrinks instead of overflowing on narrow phones or large text.
    final text = FittedBox(fit: BoxFit.scaleDown, child: Text(label, maxLines: 1));
    final icn = Icon(icon, size: 18);
    if (filled) {
      return FilledButton.icon(
        onPressed: onTap,
        style: ButtonStyle(
          minimumSize: minSize,
          padding: padding,
          shape: shape,
          backgroundColor: WidgetStatePropertyAll(p.primary),
          foregroundColor: WidgetStatePropertyAll(p.onPrimary),
        ),
        icon: icn,
        label: text,
      );
    }
    // Outlined: a thin border on the cream surface, with the text in the ink colour.
    return OutlinedButton.icon(
      onPressed: onTap,
      style: ButtonStyle(
        minimumSize: minSize,
        padding: padding,
        shape: shape,
        side: WidgetStatePropertyAll(BorderSide(color: p.border)),
        foregroundColor: WidgetStatePropertyAll(p.text),
      ),
      icon: icn,
      label: text,
    );
  }
}
