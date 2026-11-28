// The "Curated Findings" block: the title with the count of findings, then one
// card per finding from the super admin, one under another. Shows an empty
// state when the admin has added none.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/hotel/domain/hotel_content_item.dart';
import '../../../../../shared/theme/theme.dart';
import 'curated_finding_card.dart';

/// The curated findings list with its heading.
class CuratedFindingsSection extends StatelessWidget {
  /// Creates the block for [findings]; [onOpen] is called with the finding whose button is tapped.
  const CuratedFindingsSection({super.key, required this.findings, required this.onOpen});

  /// The findings to show, in the admin's order.
  final List<HotelContentItem> findings;

  /// Called with the tapped finding.
  final void Function(HotelContentItem finding) onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the heading with the count of findings.
          Wrap(
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
          const SizedBox(height: IgongoSpace.md),
          // Step 2: no findings yet, so say so; otherwise one card per finding.
          if (findings.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: IgongoSpace.lg),
              child: Text('No curated findings yet.', style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
            )
          else
            for (final finding in findings)
              Padding(
                padding: const EdgeInsets.only(bottom: IgongoSpace.lg),
                child: CuratedFindingCard(finding: finding, onOpen: () => onOpen(finding)),
              ),
        ],
      ),
    );
  }
}
