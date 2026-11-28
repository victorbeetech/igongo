// The "Curated Findings" block: the title with a count and a Sort button, then one
// card per finding, one under another. The screen owns the heart and sort state.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../domain/curated_finding.dart';
import 'curated_finding_card.dart';

/// The curated findings list with its heading.
class CuratedFindingsSection extends StatelessWidget {
  /// Creates the block. [favourites] holds the indexes of the findings the guest saved.
  const CuratedFindingsSection({
    super.key,
    required this.findings,
    required this.favourites,
    required this.onFavourite,
    required this.onOpen,
    required this.onSort,
  });

  /// Called when the Sort button is tapped.
  final VoidCallback onSort;

  /// The findings to show, in the admin's order.
  final List<CuratedFinding> findings;

  /// The indexes of the findings marked as favourite.
  final Set<int> favourites;

  /// Called with a finding's index when its favourite button is tapped.
  final ValueChanged<int> onFavourite;

  /// Called with a finding's index when its button is tapped.
  final ValueChanged<int> onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the heading with the count of matches, and the Sort button on the right.
          Row(
            children: [
              Expanded(
                child: Wrap(
                  spacing: IgongoSpace.sm,
                  runSpacing: IgongoSpace.xs,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text('Curated Findings', style: context.text.displaySmall),
                    DecoratedBox(
                      decoration: BoxDecoration(color: p.warmCard, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                        child: Text(
                          '${findings.length} Matches',
                          style: context.text.labelSmall?.copyWith(color: p.warning, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              TextButton.icon(
                onPressed: onSort,
                icon: Icon(Icons.swap_vert, size: IgongoSpace.md, color: p.primary),
                label: Text('Sort', style: context.text.labelSmall?.copyWith(color: p.primary, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: no findings yet, so say so; otherwise one card per finding.
          if (findings.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: IgongoSpace.lg),
              child: Text('No curated findings yet.', style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
            )
          else
            for (var i = 0; i < findings.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: IgongoSpace.lg),
                child: CuratedFindingCard(
                  finding: findings[i],
                  favourite: favourites.contains(i),
                  onFavourite: () => onFavourite(i),
                  onOpen: () => onOpen(i),
                ),
              ),
        ],
      ),
    );
  }
}
