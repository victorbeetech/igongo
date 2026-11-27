// A small note under the dishes about where the food comes from. The wording is
// the design's copy; the hotel should confirm it before launch.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The farm note: a leaf, then one line of text.
class FarmTip extends StatelessWidget {
  /// Creates the note.
  const FarmTip({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: a soft panel with a leaf icon and the note beside it.
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.eco_outlined, color: p.primaryText),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Text(
              'All vegetables and herbs are harvested daily from the Igongo Organic Farm along Biharwe Hill.',
              style: context.text.bodySmall?.copyWith(color: p.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}
