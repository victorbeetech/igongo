// One room, ticket, event or item in the list: a thumbnail, its name, a short
// description and the price. The whole card opens the booking details.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/ugx.dart';
import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';
import '../domain/offering.dart';

/// A list card for one offering.
class OfferingCard extends StatelessWidget {
  /// Creates the card for [offering]; [unit] is the word for one unit (room, ticket).
  const OfferingCard({super.key, required this.offering, required this.unit, required this.onTap});

  /// What is on sale.
  final Offering offering;

  /// The word for one unit at this module.
  final String unit;

  /// Opens the booking details.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final o = offering;
    // Step 1: the price line; nights are priced per night, enquiries ask for a price.
    final price = switch (o.kind) {
      'enquiry' => 'Ask for a price',
      'nights' => '${ugx(o.price)} per night',
      _ => '${ugx(o.price)} per $unit',
    };
    return IgongoCard(
      onTap: onTap,
      child: Row(
        spacing: IgongoSpace.md,
        children: [
          // Step 2: the thumbnail, a red-tinted square with an icon until photos are added.
          Container(
            width: IgongoTouch.preferred * 1.5,
            height: IgongoTouch.preferred * 1.5,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: p.primaryContainer,
              borderRadius: BorderRadius.circular(IgongoRadius.md),
            ),
            child: Icon(Icons.hotel_outlined, color: p.primaryText),
          ),
          // Step 3: the words, and the arrow.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.xs,
              children: [
                Text(o.name, style: context.text.titleMedium),
                if (o.description case final d?) Text(d, maxLines: 2, overflow: TextOverflow.ellipsis),
                Text(price, style: context.text.bodySmall?.copyWith(color: p.primaryText)),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: p.textMuted),
        ],
      ),
    );
  }
}
