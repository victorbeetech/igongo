// One quick-action card on the guest home: a tinted icon disc, a bold title and a
// muted subtitle, in a bordered surface. Tapping it opens that area.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A tappable quick-action card (Book stay, Dine in, Museum).
class GuestQuickAction extends StatelessWidget {
  /// Creates the card.
  const GuestQuickAction({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  /// The icon in the disc.
  final IconData icon;

  /// The bold title.
  final String title;

  /// The muted line under the title.
  final String subtitle;

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Material(
      color: p.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        side: BorderSide(color: p.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xxs, vertical: IgongoSpace.md),
          // Step 1: the disc, then the title and subtitle, all centred in the card.
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DecoratedBox(
                decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
                child: Padding(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  child: Icon(icon, size: IgongoSpace.lg, color: p.primary),
                ),
              ),
              const SizedBox(height: IgongoSpace.sm),
              Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: context.text.labelLarge?.copyWith(color: p.text, fontWeight: FontWeight.w700),
              ),
              Text(
                subtitle,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: context.text.labelSmall?.copyWith(color: p.textMuted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
