// The promotions slideshow behind the guest greeting: two business slides
// (a new offer, the hotel at night) that crossfade. The pictures come from
// GuestPhotos.promos, so the super admin can change them later (wait list).

import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/photo/guest_photos.dart';
import '../../../../shared/ui/photo/photo_slot.dart';
import '../../../../shared/ui/slides/fade_slides.dart';

/// The home's promotions banner.
class PromoSlides extends StatelessWidget {
  /// Creates the banner; it fills the space it is given.
  const PromoSlides({super.key});

  @override
  Widget build(BuildContext context) => FadeSlides(
    slides: [
      for (final promo in GuestPhotos.promos)
        PhotoSlot(
          width: double.infinity,
          height: double.infinity,
          asset: promo.asset,
          alignment: promo.alignment,
          icon: Icons.local_offer_outlined,
        ),
    ],
  );
}
