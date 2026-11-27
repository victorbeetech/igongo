// The points pill on the guest home: a small cream pill with the guest's points.
// Points are not wired to the API yet, so the number is a dash until they are.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The points pill, shown in the top row.
class GuestPointsPill extends StatelessWidget {
  /// Creates the pill.
  const GuestPointsPill({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      // Step 1: a cream pill with a soft edge, in the theme's warm colours.
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        color: p.warmCream,
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
        border: Border.all(color: p.border),
      ),
      // Step 2: the icon and the points, one line.
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.workspace_premium_outlined, size: IgongoSpace.md, color: p.primaryText),
          const SizedBox(width: IgongoSpace.xxs),
          Text(
            '— Pts',
            style: context.text.labelSmall?.copyWith(color: p.text, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
