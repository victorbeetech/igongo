// "Your Itinerary & Bookings": a heading with See All (the count), then up to
// two of the guest's latest bookings from the API. An empty list says so in a line.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/booking.dart';
import 'itinerary_card.dart';

/// The itinerary section. [bookings] is newest first; only the first two show.
class ItinerarySection extends StatelessWidget {
  /// Creates the section; [onOpen] opens My bookings and [onReceipt] the receipts.
  const ItinerarySection({
    super.key,
    required this.bookings,
    required this.onOpen,
    required this.onReceipt,
  });

  /// The guest's bookings, newest first.
  final List<Booking> bookings;

  /// Opens My bookings (See All and View).
  final VoidCallback onOpen;

  /// Opens the receipts.
  final VoidCallback onReceipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.sm,
      children: [
        // Step 1: the heading and See All with the count.
        Row(
          children: [
            Expanded(
              child: Text(
                'Your Itinerary & Bookings',
                style: context.text.headlineSmall?.copyWith(color: p.primaryText),
              ),
            ),
            TextButton(
              onPressed: onOpen,
              child: Text('See All (${bookings.length})'),
            ),
          ],
        ),
        // Step 2: no bookings yet, or up to two cards.
        if (bookings.isEmpty)
          Text('Your bookings will show here.', style: context.text.bodySmall?.copyWith(color: p.textMuted))
        else
          for (final b in bookings.take(2))
            ItineraryCard(booking: b, onView: onOpen, onReceipt: onReceipt),
      ],
    );
  }
}
