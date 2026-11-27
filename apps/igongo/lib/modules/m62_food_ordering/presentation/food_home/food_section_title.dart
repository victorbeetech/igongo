// The title over the dish grid: the chosen section's name, or "Chef's Signatures"
// when every section is shown, with a short line under it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A title and a line under it for the dish grid.
class FoodSectionTitle extends StatelessWidget {
  /// Creates the title block.
  const FoodSectionTitle({super.key, required this.title, required this.subtitle});

  /// The heading.
  final String title;

  /// The short line under the heading.
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    // Step 1: heading, then the muted line.
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.xl, IgongoSpace.lg, IgongoSpace.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: text.headlineSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text)),
          const SizedBox(height: IgongoSpace.xxs),
          Text(subtitle, style: text.bodySmall?.copyWith(color: p.textMuted)),
        ],
      ),
    );
  }
}
