// "Today at Igongo": a placeholder in the shape of the final panel. It sits
// below the fold; photos and short videos are added once the hotel sends them.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/card/igongo_card.dart';

/// The placeholder panel for today's news.
class TodayPlaceholder extends StatelessWidget {
  /// Creates the placeholder.
  const TodayPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      color: p.surfaceAlt,
      child: Row(
        children: [
          // Step 1: the icon, in the brand red.
          Icon(Icons.play_circle_outline, color: p.primary),
          const SizedBox(width: IgongoSpace.md),
          // Step 2: the title and a line saying what is coming.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Today at Igongo', style: context.text.titleSmall?.copyWith(color: p.text)),
                Text(
                  'Photos and short videos are coming soon',
                  style: context.text.bodySmall?.copyWith(color: p.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
