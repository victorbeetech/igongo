// S49-01 Notice board, live: posts for me, pinned first, with a "New" mark
// on unread ones and a like button when allowed. Tapping a post opens it
// (S49-02). Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../application/notice_providers.dart';
import '../../domain/board_page.dart';
import '../post_detail/post_detail_screen.dart';

/// The notice board.
class NoticeBoardScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const NoticeBoardScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<BoardPage>(
    screenName: screen.spec.name,
    value: ref.watch(boardProvider),
    onRetry: () => ref.invalidate(boardProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, board, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(boardProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (board.posts.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No posts yet.')),
          for (final n in board.posts)
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
              child: IgongoCard(
                onTap: () =>
                    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => PostDetailScreen(id: n.id))),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    Row(
                      spacing: IgongoSpace.sm,
                      children: [
                        if (n.pinned) const Icon(Icons.push_pin_outlined, size: 16, semanticLabel: 'Pinned'),
                        Expanded(child: Text(n.title, style: context.text.titleMedium)),
                        if (!n.readByMe) const StatusChip('New'),
                      ],
                    ),
                    Text(n.authorName, style: context.text.bodySmall),
                    Text(n.body, maxLines: 3, overflow: TextOverflow.ellipsis),
                    if (board.canLike && n.allowLikes)
                      IgongoButton(
                        label: '${n.likes} like${n.likes == 1 ? '' : 's'}',
                        icon: n.likedByMe ? Icons.favorite : Icons.favorite_border,
                        variant: ButtonVariant.text,
                        onPressed: () async {
                          await ref.read(noticesApiProvider).toggleLike(n.id);
                          ref.invalidate(boardProvider);
                        },
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
