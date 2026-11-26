// Comments with a box to add one. Shared by every module whose records
// take comments (faults, checkups and more).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../format/when.dart';
import '../ui/button/igongo_button.dart';
import '../ui/field/igongo_field.dart';
import '../ui/list_row/igongo_list_row.dart';
import '../ui/section/section_header.dart';
import '../ui/toast/igongo_toast.dart';
import 'comment.dart';

/// The comments and, when [canComment], the box.
class CommentBox extends StatefulWidget {
  /// Creates the box; [onSend] saves one comment.
  const CommentBox({super.key, required this.comments, required this.canComment, required this.onSend});

  /// The comments so far, oldest first.
  final List<Comment> comments;

  /// False hides the box (no permission, or comments are off).
  final bool canComment;

  /// Saves a comment; throws when the API refuses.
  final Future<void> Function(String body) onSend;

  @override
  State<CommentBox> createState() => _CommentBoxState();
}

class _CommentBoxState extends State<CommentBox> {
  final _text = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  /// Sends the comment; a refusal shows as a toast.
  Future<void> _send() async {
    final body = _text.text.trim();
    if (body.isEmpty) return;
    setState(() => _busy = true);
    try {
      await widget.onSend(body);
      _text.clear();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      SectionHeader('Comments (${widget.comments.length})'),
      if (widget.comments.isEmpty)
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Text('No comments yet.'),
        ),
      for (final c in widget.comments) IgongoListRow(title: c.authorName, subtitle: '${c.body}\n${dayTime(c.at)}'),
      if (widget.canComment)
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            spacing: IgongoSpace.sm,
            children: [
              IgongoField(label: 'Write a comment', controller: _text, lines: 2),
              IgongoButton(label: 'Comment', expand: true, onPressed: _busy ? null : _send),
            ],
          ),
        ),
    ],
  );
}
