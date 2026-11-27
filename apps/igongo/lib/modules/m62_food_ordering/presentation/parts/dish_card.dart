// One dish in the menu grid: photo, bold name, short description, stars and a
// bold red price with a + button. Tapping the card (or +) opens the dish page.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/menu_item.dart';
import 'photo_placeholder.dart';

/// A dish card for the two-column menu grid.
class DishCard extends StatelessWidget {
  /// Creates the card for [item]; [stars] is the dish's rating words, if any.
  const DishCard({super.key, required this.item, required this.onOpen, this.stars});

  /// The dish.
  final MenuItem item;

  /// The rating words, such as "4.5 ★ (12)", or null.
  final String? stars;

  /// Opens the dish page; null when the dish is out today.
  final VoidCallback? onOpen;

  @override
  Widget build(BuildContext context) {
    final t = context.text;
    final p = context.palette;
    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onOpen,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step 1: the photo area, 16:10 so the text below always has room.
            AspectRatio(
              aspectRatio: 16 / 10,
              child: PhotoPlaceholder(url: item.photoUrl, icon: Icons.fastfood),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(IgongoSpace.sm),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Step 2: the name in bold, on one line.
                    Text(
                      item.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: t.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                    ),
                    // Step 3: a short description, at most two lines.
                    if (item.description case final d? when d.isNotEmpty)
                      Text(d, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.bodySmall),
                    if (stars case final s?) Text(s, style: t.bodySmall),
                    const Spacer(),
                    // Step 4: the bold red price with the + button, or "Out today".
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.available ? ugx(item.price) : 'Out today',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: t.titleSmall?.copyWith(
                              color: item.available ? p.primaryText : p.textMuted,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        if (item.available)
                          Semantics(
                            button: true,
                            label: 'Add ${item.name}',
                            child: Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(color: p.primary, shape: BoxShape.circle),
                              child: Icon(Icons.add, color: p.onPrimary, size: 20),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
