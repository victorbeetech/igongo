// The live strip under the search bar: the weather, the sunset time and whether the
// resort is open. The weather and sunset are not wired to a feed yet, so they show a
// dash until they are; the open badge is the only fixed word.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The one-line status strip.
class GuestStatusStrip extends StatelessWidget {
  /// Creates the strip.
  const GuestStatusStrip({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.xs),
      decoration: BoxDecoration(
        color: p.surfaceAlt,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        border: Border.all(color: p.border),
      ),
      // Step 1: weather and sunset on the left, the open badge on the right.
      child: Row(
        children: [
          Expanded(
            child: Row(
              children: [
                Icon(Icons.wb_cloudy_outlined, size: IgongoSpace.md, color: p.warning),
                const SizedBox(width: IgongoSpace.xxs),
                Text('— °C', style: context.text.labelSmall?.copyWith(color: p.text)),
                const SizedBox(width: IgongoSpace.sm),
                Flexible(
                  child: Text(
                    'Sunset time coming soon',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.text.labelSmall?.copyWith(color: p.textMuted),
                  ),
                ),
              ],
            ),
          ),
          // Step 2: the open badge, in the theme's success colour on a soft tint.
          DecoratedBox(
            decoration: BoxDecoration(
              color: p.success.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(IgongoRadius.pill),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
              child: Text(
                'Resort open',
                style: context.text.labelSmall?.copyWith(color: p.success, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
