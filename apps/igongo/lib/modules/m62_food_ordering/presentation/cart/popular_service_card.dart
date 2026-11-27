// One popular service: a rounded photo card with its name under the photo.
// Tapping it opens the service's screen.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../app/navigation/open_target.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/guest_photo.dart';
import '../../domain/popular_service.dart';

/// A tappable card for one popular service.
class PopularServiceCard extends StatelessWidget {
  /// Creates the card for [service].
  const PopularServiceCard({super.key, required this.service});

  /// The service shown.
  final PopularService service;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface,
      elevation: IgongoElevation.card,
      shadowColor: palette.text.withValues(alpha: 0.2),
      borderRadius: BorderRadius.circular(IgongoRadius.lg),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => openTarget(context, service.screenId),
        child: Column(
          children: [
            // Step 1: the photo fills the top of the card.
            Expanded(child: GuestPhoto(asset: service.asset, label: service.label)),
            // Step 2: the name under the photo.
            Padding(
              padding: const EdgeInsets.symmetric(vertical: IgongoSpace.sm),
              child: Text(service.label, style: context.text.labelLarge),
            ),
          ],
        ),
      ),
    );
  }
}
