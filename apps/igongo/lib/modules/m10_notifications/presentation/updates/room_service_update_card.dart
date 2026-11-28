// The room service update: the order on its way, with a photo strip and a courier chip.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/guest_photo.dart';
import '../../../../shared/ui/photo/guest_photos.dart';
import 'updates_card_frame.dart';

/// The room service card. Its content is placeholder until the order feed is wired.
class RoomServiceUpdateCard extends StatelessWidget {
  /// Creates the card. [unread] shows the red dot.
  const RoomServiceUpdateCard({super.key, required this.unread});

  /// Whether the card is still unread.
  final bool unread;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return UpdatesCardFrame(
      icon: Icons.restaurant,
      // The accent tint marks the orders and stays category.
      iconBackground: p.accent.withValues(alpha: 0.2),
      iconColor: p.text,
      title: 'Room Service Order on the Way',
      time: '12 mins ago',
      unread: unread,
      body: Text.rich(
        TextSpan(
          style: text.bodyMedium?.copyWith(color: p.textMuted),
          children: [
            const TextSpan(text: 'Your order of '),
            TextSpan(
              text: 'Flame-Grilled Tilapia & Passion Juice',
              style: TextStyle(color: p.text, fontWeight: FontWeight.w600),
            ),
            const TextSpan(text: ' from Kaahwa Kanuzire is being delivered to '),
            TextSpan(
              text: 'Cottage 7 Veranda',
              style: TextStyle(color: p.primaryText, fontWeight: FontWeight.w700),
            ),
            const TextSpan(text: '.'),
          ],
        ),
      ),
      // The photo strip runs the full width under the text, with the courier chip on it.
      footer: ClipRRect(
        borderRadius: BorderRadius.circular(IgongoRadius.sm),
        child: SizedBox(
          height: 112,
          width: double.infinity,
          child: Stack(
            fit: StackFit.expand,
            children: [
              const GuestPhoto(asset: GuestPhotos.foodFish),
              // A dark fade from the bottom so the chip reads on any photo.
              DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      IgongoColorsLight.brandInk.withValues(alpha: 0.6),
                      IgongoColorsLight.brandInk.withValues(alpha: 0),
                    ],
                  ),
                ),
              ),
              const Positioned(left: IgongoSpace.sm, bottom: IgongoSpace.sm, child: _CourierChip()),
            ],
          ),
        ),
      ),
    );
  }
}

/// The courier chip on the photo: the rider's name and how far away they are.
class _CourierChip extends StatelessWidget {
  /// Creates the chip.
  const _CourierChip();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        color: p.surface.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.local_shipping, size: 13, color: p.primaryText),
          const SizedBox(width: IgongoSpace.xs),
          Text(
            'Courier: Ronald M. • 4 mins away',
            style: context.text.labelSmall?.copyWith(color: p.text, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
