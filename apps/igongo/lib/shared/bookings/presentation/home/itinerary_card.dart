// One upcoming or recent booking in "Your Itinerary & Bookings": an icon, the
// name, when it is for, its status, and two buttons (View opens My bookings,
// Receipt opens the receipts).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/card/soft_card.dart';
import '../../domain/booking.dart';
import '../../domain/booking_status_label.dart';
import 'booking_status_chip.dart';

/// One booking card in the itinerary list.
class ItineraryCard extends StatelessWidget {
  /// Creates the card for [booking]; [onView] and [onReceipt] open the matching screens.
  const ItineraryCard({super.key, required this.booking, required this.onView, required this.onReceipt});

  /// The booking shown.
  final Booking booking;

  /// Opens the booking in My bookings.
  final VoidCallback onView;

  /// Opens the receipts.
  final VoidCallback onReceipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SoftCard(
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the icon, the name and when it is for, with the status chip.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.sm,
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: p.primaryContainer,
                foregroundColor: p.primaryText,
                child: const Icon(Icons.hotel_outlined, size: 20),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      booking.offeringName,
                      style: context.text.titleSmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      booking.when,
                      style: context.text.bodySmall?.copyWith(color: p.textMuted),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              BookingStatusChip(label: bookingStatusLabel(booking.status)),
            ],
          ),
          // Step 2: the two buttons, right-aligned.
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            spacing: IgongoSpace.sm,
            children: [
              OutlinedButton(onPressed: onReceipt, child: const Text('Receipt')),
              FilledButton.tonal(onPressed: onView, child: const Text('View')),
            ],
          ),
        ],
      ),
    );
  }
}
