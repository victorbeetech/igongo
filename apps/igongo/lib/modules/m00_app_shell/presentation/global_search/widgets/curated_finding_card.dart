// One curated finding card on the search screen: the picture (or the shared
// placeholder), the title and subtitle from the admin, and an Open button that
// opens the finding's screen.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/hotel/domain/hotel_content_item.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// A card for one curated finding. [onOpen] runs when the card's button is tapped.
class CuratedFindingCard extends StatelessWidget {
  /// Creates the card for [finding].
  const CuratedFindingCard({super.key, required this.finding, required this.onOpen});

  /// The admin's finding to show.
  final HotelContentItem finding;

  /// Called when the Open button is tapped.
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return DecoratedBox(
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Step 1: the picture, or the shared placeholder while the hotel has no picture for it.
            SizedBox(height: 160, child: GuestPhoto(label: finding.title)),
            // Step 2: the title, the subtitle and the Open button.
            Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(finding.title, style: context.text.titleMedium, maxLines: 2, overflow: TextOverflow.ellipsis),
                  if (finding.subtitle.isNotEmpty) ...[
                    const SizedBox(height: IgongoSpace.xs),
                    Text(finding.subtitle, style: context.text.bodySmall?.copyWith(color: p.textMuted)),
                  ],
                  const SizedBox(height: IgongoSpace.md),
                  Align(
                    alignment: AlignmentDirectional.centerEnd,
                    child: FilledButton(
                      onPressed: onOpen,
                      style: FilledButton.styleFrom(backgroundColor: p.primary, foregroundColor: p.onPrimary),
                      child: Text('Open', style: context.text.labelMedium?.copyWith(color: p.onPrimary)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
