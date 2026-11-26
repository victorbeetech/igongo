// A shop or outlet row for guest screens: a picture on the left, the name,
// a line of detail, small badges and a round arrow. The picture is a plain
// placeholder until a real photo is set.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../photo/photo_slot.dart';

/// One shop row.
class GuestShopRow extends StatelessWidget {
  /// Creates the row.
  const GuestShopRow({
    super.key,
    required this.title,
    this.detail,
    this.badges = const [],
    this.selected = false,
    this.photo,
    required this.onTap,
  });

  /// The shop's name.
  final String title;

  /// A line under the name, if any.
  final String? detail;

  /// Small badges under the detail, such as the order types.
  final List<String> badges;

  /// True for the shop being shown now (a red outline).
  final bool selected;

  /// The picture's address or asset path, or null for the placeholder.
  final String? photo;

  /// Called when the row is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      selected: selected,
      label: title,
      child: Material(
        color: p.surfaceAlt,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          side: BorderSide(color: selected ? p.primary : p.border, width: selected ? 2 : 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.sm),
            child: Row(
              spacing: IgongoSpace.md,
              children: [
                // Step 1: the picture.
                ClipRRect(
                  borderRadius: BorderRadius.circular(IgongoRadius.md),
                  child: PhotoSlot(width: 72, height: 72, asset: photo, icon: Icons.storefront_outlined),
                ),
                // Step 2: name, detail and badges.
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: IgongoSpace.xs,
                    children: [
                      Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: context.text.titleMedium),
                      if (detail != null) Text(detail!, style: context.text.bodySmall),
                      if (badges.isNotEmpty)
                        Wrap(
                          spacing: IgongoSpace.xs,
                          runSpacing: IgongoSpace.xs,
                          children: [for (final b in badges) _Badge(b)],
                        ),
                    ],
                  ),
                ),
                // Step 3: the round arrow.
                CircleAvatar(
                  radius: 14,
                  backgroundColor: p.primaryContainer,
                  foregroundColor: p.primaryText,
                  child: const Icon(Icons.chevron_right, size: 20),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A small rounded badge.
class _Badge extends StatelessWidget {
  const _Badge(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: context.palette.primaryContainer,
      borderRadius: BorderRadius.circular(IgongoRadius.pill),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      child: Text(label, style: context.text.labelSmall?.copyWith(color: context.palette.onPrimaryContainer)),
    ),
  );
}
