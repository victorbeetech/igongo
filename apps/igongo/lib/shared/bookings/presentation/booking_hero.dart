// The big picture slideshow at the top of the Bookings home: the hotel, the
// spa, the restaurant and the other services, fading from one to the next. The
// pictures are placeholders where the hotel has not sent one yet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/bar/wavy_bottom_clipper.dart';
import '../../ui/photo/guest_photos.dart';
import '../../ui/photo/photo_slot.dart';
import '../../ui/slides/fade_slides.dart';

/// The Bookings home hero.
class BookingHero extends StatefulWidget {
  /// Creates the hero, [height] tall below the phone's clock.
  const BookingHero({super.key, this.height = 280});

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
  State<BookingHero> createState() => _BookingHeroState();
}

class _BookingHeroState extends State<BookingHero> {
  /// The slide showing now (for the dots).
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final top = MediaQuery.paddingOf(context).top;
    return ClipPath(
      // The bottom edge is a soft wave, so the cream page curves up into the picture.
      clipper: const WavyBottomClipper(),
      child: SizedBox(
        height: widget.height + top,
        width: double.infinity,
        child: Stack(
          fit: StackFit.expand,
          children: [
            FadeSlides(
              onChanged: (i) => setState(() => _index = i),
              slides: [
                for (final s in BookingHero._slides)
                  PhotoSlot(width: double.infinity, height: double.infinity, asset: s.$1, icon: s.$2),
              ],
            ),
            // The page dots, centred above the wave: the slide showing is red, the others white.
            Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.only(bottom: IgongoSpace.xl),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: IgongoSpace.xs,
                  children: [
                    for (var i = 0; i < BookingHero._slides.length; i++)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: i == _index ? p.primary : p.surface,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
