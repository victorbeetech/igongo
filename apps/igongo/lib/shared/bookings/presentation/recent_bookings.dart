// The "Recent Bookings" section of the Bookings home: a heading with See All,
// then up to three of the guest's latest bookings, each with a room picture, its
// name and date, and a View button. An empty list says so in a line.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';
import '../../ui/photo/guest_photos.dart';
import '../../ui/photo/photo_slot.dart';
import '../domain/booking.dart';

/// The recent bookings list.
class RecentBookings extends StatelessWidget {
  /// Creates the section; [onOpen] opens My bookings (See All and View).
  const RecentBookings({super.key, required this.bookings, required this.onOpen});

  /// The guest's bookings, newest first (only the first three show).
  final List<Booking> bookings;

  /// Opens My bookings.
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.sm,
      children: [
        // Step 1: the heading and See All.
        Row(
          children: [
            Expanded(child: Text('Recent Bookings', style: context.text.titleMedium)),
            TextButton(onPressed: onOpen, child: const Text('See All')),
          ],
        ),
        // Step 2: no bookings yet, or one card per recent booking.
        if (bookings.isEmpty)
          Text('Your bookings will show here.', style: context.text.bodySmall?.copyWith(color: p.textMuted))
        else
          for (final b in bookings.take(3))
            IgongoCard(
              padding: EdgeInsets.zero,
              onTap: onOpen,
              child: Row(
                spacing: IgongoSpace.md,
                children: [
                  const PhotoSlot(width: 84, height: 64, asset: GuestPhotos.hotelEntrance, icon: Icons.bed_outlined),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(b.offeringName, style: context.text.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text(b.when, style: context.text.bodySmall?.copyWith(color: p.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: IgongoSpace.md),
                    child: TextButton(onPressed: onOpen, child: const Text('View')),
                  ),
                ],
              ),
            ),
      ],
    );
  }
}
