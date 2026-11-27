// The grey note with a blue info icon, used under the reset form to say where
// the reset link goes.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A small note with an info icon.
class AuthInfoNote extends StatelessWidget {
  /// Creates the note with its [text].
  const AuthInfoNote({super.key, required this.text});

  /// The words in the note.
  final String text;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: context.palette.surfaceAlt,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
    ),
    child: Padding(
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline, size: 18, color: context.palette.info),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(child: Text(text, style: context.text.bodySmall)),
        ],
      ),
    ),
  );
}
