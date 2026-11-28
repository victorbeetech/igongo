// One curated finding card: a picture with a kind badge, a venue tag and a
// favourite button on it; then the rating, title, description, price and the
// action button. Colours and text sizes come from the theme tokens only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';
import '../../../domain/curated_finding.dart';
import '../../../domain/discovery_kind.dart';

/// A card for one finding. [onFavourite] is called when the heart is tapped.
class CuratedFindingCard extends StatelessWidget {
  /// Creates the card for [finding].
  const CuratedFindingCard({
    super.key,
    required this.finding,
    required this.favourite,
    required this.onFavourite,
    required this.onOpen,
  });

  /// Called when the card's button is tapped.
  final VoidCallback onOpen;

  /// The finding to show.
  final CuratedFinding finding;

  /// Whether the guest has saved it (a filled heart).
  final bool favourite;

  /// Called when the heart is tapped.
  final VoidCallback onFavourite;

  /// The picture's height, in logical pixels.
  static const double _pictureHeight = 192;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Material(
      color: p.surface,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        side: BorderSide(color: p.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the picture, with the kind badge and venue tag on the left and the heart on the right.
          SizedBox(
            height: _pictureHeight,
            child: Stack(
              children: [
                Positioned.fill(child: GuestPhoto(asset: finding.photo)),
                Positioned(
                  top: IgongoSpace.sm,
                  left: IgongoSpace.sm,
                  right: IgongoSpace.xxl + IgongoSpace.sm,
                  child: Row(
                    children: [
                      _KindBadge(kind: finding.kind),
                      const SizedBox(width: IgongoSpace.sm),
                      Flexible(child: _VenueTag(text: finding.venue)),
                    ],
                  ),
                ),
                Positioned(top: IgongoSpace.sm, right: IgongoSpace.sm, child: _FavouriteButton(on: favourite, onTap: onFavourite)),
              ],
            ),
          ),
          // Step 2: the text block: rating and tagline, title, description.
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.star, size: IgongoSpace.lg, color: p.warning),
                    const SizedBox(width: IgongoSpace.xxs),
                    Text(finding.rating?.toStringAsFixed(1) ?? _dash, style: context.text.labelMedium?.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(width: IgongoSpace.xs),
                    Flexible(
                      child: Text(
                        '(${finding.reviews ?? _dash} reviews)',
                        overflow: TextOverflow.ellipsis,
                        style: context.text.bodySmall,
                      ),
                    ),
                    const SizedBox(width: IgongoSpace.sm),
                    Flexible(
                      child: Text(
                        (finding.tagline ?? _dash).toUpperCase(),
                        textAlign: TextAlign.end,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.labelSmall?.copyWith(
                          color: p.warning,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                Text(
                  finding.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.titleLarge?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: IgongoSpace.xs),
                Text(
                  finding.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.bodyMedium?.copyWith(color: p.textMuted),
                ),
                const SizedBox(height: IgongoSpace.md),
                // Step 3: the price on the left, the action button on the right.
                Row(
                  children: [
                    Expanded(child: _PriceBlock(label: finding.priceLabel, price: finding.price, unit: finding.unit)),
                    FilledButton(
                      onPressed: onOpen,
                      style: FilledButton.styleFrom(
                        backgroundColor: p.primary,
                        foregroundColor: p.onPrimary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(IgongoRadius.md)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(finding.actionLabel, style: context.text.labelMedium?.copyWith(color: p.onPrimary)),
                          const SizedBox(width: IgongoSpace.xs),
                          const Icon(Icons.arrow_forward, size: IgongoSpace.lg),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// The dash shown for any value the super admin has not set yet.
const String _dash = '—';

/// The kind badge on the picture: its icon, word and colour. Colours follow the kind.
class _KindBadge extends StatelessWidget {
  const _KindBadge({required this.kind});

  /// Food, stay or tour. Null until the admin sets one; the badge then shows a dash.
  final DiscoveryKind? kind;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: pick the icon, word, fill and text colour for this kind.
    final (IconData icon, String word, Color fill, Color ink) = switch (kind) {
      null => (Icons.label_outline, _dash, p.surfaceAlt, p.text),
      DiscoveryKind.food => (Icons.dinner_dining, 'Food', p.primary, p.onPrimary),
      DiscoveryKind.stay => (Icons.hotel, 'Stay', p.warning, p.background),
      DiscoveryKind.tour => (Icons.museum, 'Tour', p.secondary, p.background),
    };
    // Step 2: the pill itself.
    return DecoratedBox(
      decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: IgongoSpace.md, color: ink),
            const SizedBox(width: IgongoSpace.xxs),
            Text(word, style: context.text.labelSmall?.copyWith(color: ink, fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

/// The venue's name on a light tag over the picture.
class _VenueTag extends StatelessWidget {
  const _VenueTag({required this.text});

  /// The venue's name.
  final String text;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: p.surface.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
        child: Text(
          text,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: context.text.labelSmall?.copyWith(color: p.text),
        ),
      ),
    );
  }
}

/// The round heart on the picture: filled in red when saved, outlined when not.
class _FavouriteButton extends StatelessWidget {
  const _FavouriteButton({required this.on, required this.onTap});

  /// Whether it is saved.
  final bool on;

  /// Called when tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Material(
      color: p.surface.withValues(alpha: 0.9),
      shape: const CircleBorder(),
      child: IconButton(
        tooltip: on ? 'Remove from favourites' : 'Add to favourites',
        onPressed: onTap,
        icon: Icon(on ? Icons.favorite : Icons.favorite_border, color: on ? p.primary : p.textMuted),
      ),
    );
  }
}

/// The price label above the amount, such as "Price" over "UGX 28,000".
class _PriceBlock extends StatelessWidget {
  const _PriceBlock({required this.label, required this.price, required this.unit});

  /// "Price" or "Rate".
  final String label;

  /// The amount in whole shillings, or null for a dash.
  final int? price;

  /// What the amount is for, such as "/night" (may be empty).
  final String unit;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(label, style: context.text.bodySmall),
        Text.rich(
          TextSpan(
            children: [
              TextSpan(
                text: price == null ? _dash : ugx(price!),
                style: context.text.labelLarge?.copyWith(color: p.primary, fontWeight: FontWeight.w700),
              ),
              if (unit.isNotEmpty) TextSpan(text: unit, style: context.text.bodySmall),
            ],
          ),
        ),
      ],
    );
  }
}
