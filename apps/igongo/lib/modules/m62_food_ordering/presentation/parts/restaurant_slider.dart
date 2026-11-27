// The restaurants across the top: a horizontal slider of same-size cards.
// The chosen restaurant has a red outline.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../domain/outlet.dart';
import 'photo_placeholder.dart';

/// A slider of restaurant cards, all the same size.
class RestaurantSlider extends StatelessWidget {
  /// Creates the slider; [onPick] gets the key of the tapped restaurant.
  const RestaurantSlider({super.key, required this.outlets, required this.selected, required this.onPick});

  /// The restaurants guests may order from.
  final List<Outlet> outlets;

  /// The key of the chosen restaurant.
  final String selected;

  /// Called with the key of the restaurant the guest taps.
  final void Function(String key) onPick;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 150,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      itemCount: outlets.length,
      separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
      itemBuilder: (context, index) {
        final o = outlets[index];
        final on = o.key == selected;
        // Step 1: every card is 200 wide, so they all match.
        return SizedBox(
          width: 200,
          child: Card(
            margin: EdgeInsets.zero,
            clipBehavior: Clip.antiAlias,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(IgongoSpace.md),
              side: BorderSide(color: on ? context.palette.primary : context.palette.border, width: on ? 2 : 1),
            ),
            child: InkWell(
              onTap: () => onPick(o.key),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Step 2: the photo fills the top, and the name sits under it.
                  Expanded(child: PhotoPlaceholder(url: o.photoUrl, icon: Icons.restaurant)),
                  Padding(
                    padding: const EdgeInsets.all(IgongoSpace.sm),
                    child: Text(
                      o.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    ),
  );
}
