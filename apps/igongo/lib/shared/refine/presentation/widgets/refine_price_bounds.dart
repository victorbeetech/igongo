// The two price boxes under the slider: MINIMUM on the left, MAXIMUM on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The MINIMUM and MAXIMUM boxes showing the chosen price ends.
class RefinePriceBounds extends StatelessWidget {
  /// Creates the pair. Each label is shown as given (a dash until prices come from the API).
  const RefinePriceBounds({super.key, required this.minLabel, required this.maxLabel});

  /// The words for the lower end.
  final String minLabel;

  /// The words for the upper end.
  final String maxLabel;

  @override
  Widget build(BuildContext context) => Row(
    spacing: IgongoSpace.sm,
    children: [
      Expanded(child: _box(context, 'MINIMUM', minLabel, TextAlign.start)),
      Expanded(child: _box(context, 'MAXIMUM', maxLabel, TextAlign.end)),
    ],
  );

  /// One box: a small caption over the price, aligned to its side.
  Widget _box(BuildContext context, String caption, String value, TextAlign align) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: BoxDecoration(color: palette.background, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
      child: Column(
        crossAxisAlignment: align == TextAlign.end ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Text(
            caption,
            style: context.text.labelSmall!.copyWith(color: palette.textMuted, fontWeight: FontWeight.w500),
          ),
          Text(
            value,
            textAlign: align,
            style: context.text.titleSmall!.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
