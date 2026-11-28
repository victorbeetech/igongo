// A white rounded card that holds a list of profile rows, with a thin divider
// between each pair, as in the design.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A bordered card with rows divided by hairlines.
class ProfileActionGroup extends StatelessWidget {
  /// Creates the group from its [children] (usually ProfileActionRow widgets).
  const ProfileActionGroup({super.key, required this.children});

  /// The rows, top to bottom.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      // Step 1: the card, with its corners cutting the rows' ink splashes.
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          border: Border.all(color: p.border),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          // Step 2: each row, with a hairline before every row but the first.
          child: Column(
            children: [
              for (var i = 0; i < children.length; i++) ...[
                if (i > 0) Divider(height: 1, thickness: 1, color: p.border),
                children[i],
              ],
            ],
          ),
        ),
      ),
    );
  }
}
