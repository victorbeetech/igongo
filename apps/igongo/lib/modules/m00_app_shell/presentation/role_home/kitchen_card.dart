// One dish in the "From our kitchen" slides: a picture, the dish's name and
// "Add to order". The picture is a placeholder until the hotel sends photos.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../m62_food_ordering/domain/menu_item.dart';

/// A tappable dish card, the same size in every slide.
class KitchenCard extends StatelessWidget {
  /// Creates the card for [item]; [onTap] opens that dish's page.
  const KitchenCard({super.key, required this.item, required this.onTap});

  /// The dish to show.
  final MenuItem item;

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      onTap: onTap,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the picture area, the same shape for every dish.
          Expanded(
            child: ColoredBox(
              color: p.surfaceAlt,
              child: Center(child: Icon(Icons.restaurant, color: p.primary, size: IgongoSpace.xxl)),
            ),
          ),
          // Step 2: the name in bold, then the call to action.
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text),
                ),
                Text(
                  'Add to order · ${ugx(item.price)}',
                  style: context.text.bodySmall?.copyWith(color: p.primary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
