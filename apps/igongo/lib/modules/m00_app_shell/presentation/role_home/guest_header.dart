// The top of the guest home: Igongo red with one small greeting line (time of
// day and first name), the alerts bell, and the banner picture below. The
// banner comes from one place (GuestPhotos.banner) so it can be changed later.
// Igongo red is the same in light and dark mode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/greeting.dart';
import '../../../../shared/theme/theme.dart';
import '../../../m62_food_ordering/presentation/menu_carousel.dart';

/// The guest home's header. [name] is the signed-in guest's, or null when signed out.
class GuestHeader extends StatelessWidget {
  /// Creates the header; [onBell] opens the notification inbox.
  const GuestHeader({super.key, this.name, required this.onBell});

  /// The guest's name.
  final String? name;

  /// Called when the bell is tapped.
  final VoidCallback onBell;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.xs, IgongoSpace.sm, IgongoSpace.lg),
      decoration: BoxDecoration(
        color: p.primary,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(IgongoSpace.xl)),
      ),
      // SafeArea keeps the greeting below the phone's clock when there is no app bar above.
      child: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step 1: one small greeting line, cut with an ellipsis if too long; the bell at the right.
            Row(
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
            // Step 2: the dish slideshow, full width.
            Padding(
              padding: const EdgeInsets.only(right: IgongoSpace.md),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(IgongoRadius.lg),
                // The slideshow of today's dishes (the banner placeholder when there are none).
                child: const MenuCarousel(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
