// A slideshow of restaurants for the Food screen: each slide is the
// restaurant's photo with its name, detail and order-type badges over a red
// strip. Tapping a slide opens that restaurant. The shown one has a red outline.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../photo/photo_slot.dart';
import '../slides/auto_slides.dart';

/// One restaurant slide's content.
class RestaurantSlide {
  /// Creates a slide.
  const RestaurantSlide({
    required this.title,
    required this.detail,
    required this.onTap,
    this.badges = const [],
    this.photo,
    this.selected = false,
  });

  /// The restaurant's name.
  final String title;

  /// A line under the name.
  final String detail;

  /// Order types it takes, such as "Dine-in".
  final List<String> badges;

  /// The photo's asset path or address, or null for the placeholder.
  final String? photo;

  /// True for the restaurant being shown now.
  final bool selected;

  /// Called when the slide is tapped.
  final VoidCallback onTap;
}

/// The restaurants slideshow, [height] tall (the same as a dish card).
class GuestRestaurantSlides extends StatelessWidget {
  /// Creates the slideshow.
  const GuestRestaurantSlides({super.key, required this.slides, this.height = 198});

  /// The restaurants.
  final List<RestaurantSlide> slides;

  /// The slideshow's height.
  final double height;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.lg);
    return ClipRRect(
      borderRadius: radius,
      child: AutoSlides(
        height: height,
        slides: [
          for (final s in slides)
            Semantics(
              button: true,
              selected: s.selected,
              label: s.title,
              child: InkWell(
                onTap: s.onTap,
                child: DecoratedBox(
                  position: DecorationPosition.foreground,
                  decoration: BoxDecoration(
                    borderRadius: radius,
                    border: Border.all(color: s.selected ? p.primary : p.border, width: s.selected ? 2 : 1),
                  ),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      PhotoSlot(width: double.infinity, height: height, asset: s.photo, icon: Icons.storefront_outlined),
                      Align(
                        alignment: Alignment.bottomLeft,
                        child: Container(
                          width: double.infinity,
                          color: p.primary.withValues(alpha: 0.85),
                          padding: const EdgeInsets.all(IgongoSpace.sm),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                s.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: context.text.titleMedium?.copyWith(color: p.onPrimary),
                              ),
                              Text(
                                [s.detail, ...s.badges].join(' · '),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: context.text.bodySmall?.copyWith(color: p.onPrimary),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
