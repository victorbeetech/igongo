// The sticky bottom bar: Clear All on the left, and Apply Filters with the results count on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import 'refine_apply_button.dart';
import 'refine_clear_button.dart';

/// The bar pinned to the bottom of the Filter & Refine sheet.
class RefineFooter extends StatelessWidget {
  /// Creates the bar. [resultCount] is the number shown on the Apply button.
  const RefineFooter({super.key, required this.resultCount, required this.onClear, required this.onApply});

  /// How many results the current filter would show.
  final int resultCount;

  /// Called when Clear All is tapped.
  final VoidCallback onClear;

  /// Called when Apply Filters is tapped.
  final VoidCallback onApply;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg + 4, IgongoSpace.md, IgongoSpace.lg + 4, IgongoSpace.md),
      decoration: BoxDecoration(
        // The bar is a little see-through, with a soft shadow along its top edge.
        color: palette.surface.withValues(alpha: 0.9),
        boxShadow: [
          BoxShadow(color: palette.text.withValues(alpha: 0.06), blurRadius: 20, offset: const Offset(0, -4)),
        ],
      ),
      child: Row(
        spacing: IgongoSpace.md,
        children: [
          Expanded(flex: 1, child: RefineClearButton(onPressed: onClear)),
          Expanded(
            flex: 2,
            child: RefineApplyButton(resultCount: resultCount, onPressed: onApply),
          ),
        ],
      ),
    );
  }
}
