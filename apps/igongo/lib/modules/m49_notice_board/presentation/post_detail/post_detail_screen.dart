// S49-02 Post detail, live: the whole post and its comments, and a box to
// comment when the post and my role allow it. Opening it marks it read.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/notice_providers.dart';
import '../../domain/post_page.dart';

/// One post, opened from the board.
class PostDetailScreen extends ConsumerStatefulWidget {
  /// Creates the screen for post [id].
  const PostDetailScreen({super.key, required this.id});

  /// The post's ID.
  final String id;

  @override
  ConsumerState<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends ConsumerState<PostDetailScreen> {
  final _comment = TextEditingController();

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  /// Sends the comment, then reloads the post.
  Future<void> _send() async {
    if (_comment.text.trim().isEmpty) return;
    try {
      await ref.read(noticesApiProvider).comment(widget.id, _comment.text.trim());
      _comment.clear();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(postProvider(widget.id));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Post')),
    body: LiveView<PostPage>(
      screenName: 'Post',
      value: ref.watch(postProvider(widget.id)),
      onRetry: () => ref.invalidate(postProvider(widget.id)),
      sample: (_) => const SizedBox.shrink(),
      builder: (context, page, session) => ScreenListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                Text(page.notice.title, style: context.text.titleLarge),
                Text('${page.notice.authorName} · ${page.likes} likes', style: context.text.bodySmall),
                Text(page.notice.body),
              ],
            ),
          ),
          if (page.notice.allowComments) ...[
            const SectionHeader('Comments'),
            for (final c in page.comments) IgongoListRow(title: c.authorName, subtitle: c.body),
            if ((session?.can('notice-board.posts.comment') ?? false))
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.lg),
                child: Column(
                  spacing: IgongoSpace.sm,
                  children: [
                    IgongoField(label: 'Write a comment', controller: _comment, lines: 2),
                    IgongoButton(label: 'Comment', expand: true, onPressed: _send),
                  ],
                ),
              ),
          ],
        ],
      ),
    ),
  );
}
