// The search bar under the guest greeting. It is a button, not a text box:
// tapping it opens the global search, where the guest types.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The search bar: a rounded surface with a magnifier and a hint.
class GuestSearchBar extends StatelessWidget {
  /// Creates the bar; [onTap] opens the global search.
  const GuestSearchBar({super.key, required this.onTap});

  /// Called when the bar is tapped.
  final VoidCallback onTap;

  /// The words inside the empty bar.
  static const _hint = 'Search food, cottages, cultural tours...';

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.lg);
    return Semantics(
      button: true,
      label: 'Search',
      child: Material(
        color: p.surface,
        shape: RoundedRectangleBorder(borderRadius: radius, side: BorderSide(color: p.border)),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
            // Step 1: the magnifier, then the hint, then a small chevron.
            child: Row(
              children: [
                Icon(Icons.search, size: IgongoSpace.lg, color: p.textMuted),
                const SizedBox(width: IgongoSpace.sm),
                Expanded(
                  child: Text(
                    _hint,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.text.bodyMedium?.copyWith(color: p.textMuted),
                  ),
                ),
                Icon(Icons.chevron_right, size: IgongoSpace.lg, color: p.textMuted),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
