// The top of the guest home: the promotions slideshow fills the whole header edge to edge, and the
// greeting line (time of day and first name) and the alerts bell sit on top of a red
// gradient at its top. The
// slides come from one place (GuestPhotos.promos) so they can be changed later.
// Igongo red is the same in light and dark mode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/greeting.dart';
import '../../../../shared/theme/theme.dart';
import 'promo_slides.dart';

/// The guest home's header. [name] is the signed-in guest's, or null when signed out.
class GuestHeader extends StatelessWidget {
  /// Creates the header; [onBell] opens the notification inbox.
  const GuestHeader({super.key, this.name, required this.onBell});

  /// The guest's name.
  final String? name;

  /// Called when the bell is tapped.
  final VoidCallback onBell;

  /// The banner's height below the phone's clock.
  static const _bannerHeight = 240.0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final top = MediaQuery.paddingOf(context).top;
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(IgongoSpace.xl)),
      child: SizedBox(
        height: _bannerHeight + top,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Step 1: the promotions slideshow, with no margins, over the whole red header.
            ColoredBox(
              color: p.primary,
              child: const PromoSlides(),
            ),
            // Step 2: a dedicated red gradient layer above the banner, whatever it shows, so the
            // greeting and the bell are always readable and a new banner can never hide them.
            Positioned(
              // A pixel past every edge, so no seam can show at the top or the sides.
              left: -1,
              right: -1,
              top: -1,
              height: top + 140,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    // Eased steps, so the bottom edge fades into the banner with no hard step.
                    colors: [
                      p.primary,
                      p.primary.withValues(alpha: 0.85),
                      p.primary.withValues(alpha: 0.55),
                      p.primary.withValues(alpha: 0.25),
                      p.primary.withValues(alpha: 0.08),
                      p.primary.withValues(alpha: 0),
                    ],
                    stops: const [0, 0.25, 0.5, 0.72, 0.9, 1],
                  ),
                ),
              ),
            ),
            // Step 3: one small greeting line (cut with an ellipsis if too long) and the bell.
            Positioned(
              left: IgongoSpace.lg,
              right: IgongoSpace.sm,
              top: top + IgongoSpace.xs,
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      greetingFor(DateTime.now(), name),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      softWrap: false,
                      style: context.text.titleSmall?.copyWith(color: p.onPrimary),
                    ),
                  ),
                  IconButton(
                    tooltip: 'Notifications',
                    icon: Icon(Icons.notifications_none, color: p.onPrimary),
                    onPressed: onBell,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
