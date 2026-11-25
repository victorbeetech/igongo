// A tile on a home screen: an icon, a label and an optional count.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../card/igongo_card.dart';

/// One home screen tile.
class HomeTile extends StatelessWidget {
  /// Creates a tile with [label] and [icon]. A [count] shows a red badge.
  const HomeTile({super.key, required this.label, required this.icon, this.count, this.onTap});

  /// The words on the tile.
  final String label;

  /// The tile's icon.
  final IconData icon;

  /// A number to show, such as items waiting.
  final String? count;

  /// What happens on tap.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the icon in a soft red square, with the count beside it.
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(IgongoSpace.sm),
                decoration: BoxDecoration(
                  color: p.primaryContainer,
                  borderRadius: BorderRadius.circular(IgongoRadius.sm),
                ),
                child: Icon(icon, size: 20, color: p.onPrimaryContainer),
              ),
              const Spacer(),
              if (count != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: p.primary, borderRadius: BorderRadius.circular(99)),
                  child: Text(
                    count!,
                    style: context.text.labelSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                  ),
                ),
            ],
          ),
          // Step 2: the label, up to three lines so long role tiles still fit.
          Text(
            label,
            style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
