// The recent searches: a title with "Clear All" on the right, then each search
// as a chip with a close icon to remove it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The recent searches block on the search screen.
class RecentSearches extends StatelessWidget {
  /// Creates the block for [searches], newest first.
  const RecentSearches({
    super.key,
    required this.searches,
    required this.onRemove,
    required this.onClear,
  });

  /// The searches to show as chips.
  final List<String> searches;

  /// Called with a search's words when its close icon is tapped.
  final ValueChanged<String> onRemove;

  /// Called when "Clear All" is tapped.
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the title with its history icon, and "Clear All" on the right.
          Row(
            children: [
              Icon(Icons.history, size: IgongoSpace.lg, color: p.warning),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(child: Text('Recent Searches', style: context.text.labelMedium)),
              if (searches.isNotEmpty)
                TextButton(
                  onPressed: onClear,
                  child: Text(
                    'Clear All',
                    style: context.text.labelSmall?.copyWith(color: p.primary, fontWeight: FontWeight.w700),
                  ),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          // Step 2: the chips, or a short note when the list is empty.
          if (searches.isEmpty)
            Text(
              'No recent searches',
              style: context.text.bodySmall?.copyWith(fontStyle: FontStyle.italic),
            )
          else
            Wrap(
              spacing: IgongoSpace.sm,
              runSpacing: IgongoSpace.sm,
              children: [
                for (final search in searches)
                  InputChip(
                    label: Text(search, style: context.text.labelMedium),
                    backgroundColor: p.surfaceAlt,
                    side: BorderSide.none,
                    deleteIconColor: p.textMuted,
                    onDeleted: () => onRemove(search),
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
