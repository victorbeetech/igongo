// The location strip at the foot of the Contact Us screen: a round pin, a small
// caption ("Hotel & Cultural Grounds") and the address under it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A soft panel that shows where the hotel is.
class LocationStrip extends StatelessWidget {
  /// Creates the strip for [caption] and [address].
  const LocationStrip({super.key, required this.caption, required this.address});

  /// The small heading, such as "Hotel & Cultural Grounds".
  final String caption;

  /// The address line under the caption.
  final String address;

  @override
  Widget build(BuildContext context) {
    // Step 1: read the theme colours for the panel.
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 2: the round pin.
          Container(
            width: 40,
            height: 40,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: p.border, shape: BoxShape.circle),
            child: Icon(Icons.location_on_outlined, size: 20, color: p.secondary),
          ),
          const SizedBox(width: IgongoSpace.md),
          // Step 3: the caption and the address, wrapping onto more lines if needed.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(caption.toUpperCase(), style: context.text.labelSmall?.copyWith(color: p.secondary)),
                const SizedBox(height: IgongoSpace.xxs),
                Text(address, style: context.text.bodySmall?.copyWith(color: p.textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
