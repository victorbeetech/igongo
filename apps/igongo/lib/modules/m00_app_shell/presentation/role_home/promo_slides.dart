// The promotions slideshow under the guest greeting: three business slides
// (a new offer, the restaurant, the hotel at night). The pictures come from
// GuestPhotos.promos, so the super admin can change them later (wait list).

import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/photo/guest_photos.dart';
import '../../../../shared/ui/photo/photo_slot.dart';
import '../../../../shared/ui/slides/auto_slides.dart';

/// The home's promotions banner.
class PromoSlides extends StatelessWidget {
  /// Creates the banner, [height] tall.
  const PromoSlides({super.key, this.height = 140});

  /// The banner's height.
  final double height;

  @override
  Widget build(BuildContext context) => AutoSlides(
    height: height,
    slides: [
      for (final promo in GuestPhotos.promos)
        PhotoSlot(
          width: double.infinity,
          height: height,
          asset: promo.asset,
          alignment: promo.alignment,
          icon: Icons.local_offer_outlined,
        ),
    ],
  );
}
