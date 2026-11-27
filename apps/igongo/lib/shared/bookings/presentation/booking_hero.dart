// The big picture slideshow at the top of the Bookings home: the hotel, the
// spa, the restaurant and the other services, fading from one to the next. The
// pictures are placeholders where the hotel has not sent one yet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../ui/photo/guest_photos.dart';
import '../../ui/photo/photo_slot.dart';
import '../../ui/slides/fade_slides.dart';

/// The Bookings home hero.
class BookingHero extends StatelessWidget {
  /// Creates the hero, [height] tall below the phone's clock.
  const BookingHero({super.key, this.height = 260});

  /// The hero's height below the phone's clock.
  final double height;

  /// The slides: hotel, spa, restaurant and other services (null photo = placeholder).
  static const _slides = <(String?, IconData)>[
    (GuestPhotos.hotelEntrance, Icons.hotel_outlined),
    (null, Icons.spa_outlined),
    (GuestPhotos.hotelKaahwaKanuzire, Icons.restaurant_outlined),
    (GuestPhotos.hotelPool, Icons.pool_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;
    return ClipRRect(
      // The picture's bottom corners are rounded, so the cream page curves up into it.
      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(IgongoSpace.xl)),
      child: SizedBox(
        height: height + top,
        width: double.infinity,
        child: FadeSlides(
          slides: [
            for (final s in _slides) PhotoSlot(width: double.infinity, height: double.infinity, asset: s.$1, icon: s.$2),
          ],
        ),
      ),
    );
  }
}
