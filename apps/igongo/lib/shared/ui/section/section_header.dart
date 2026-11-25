// A small header above a group of rows, with an optional action on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A section title such as "Details" or "History".
class SectionHeader extends StatelessWidget {
  /// Creates a header with [title] and an optional [action] button.
  const SectionHeader(this.title, {super.key, this.action, this.onAction});

  /// The section name.
  final String title;

  /// The words of the action, such as "See all".
  final String? action;

  /// What the action does.
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.xs),
      child: Row(
        children: [
          // Upper case and letter-spaced, in muted text, so it reads as a label.
          Expanded(
            child: Text(
              title.toUpperCase(),
              style: context.text.labelSmall?.copyWith(
                color: context.palette.textMuted,
                letterSpacing: 1.1,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          if (action != null) TextButton(onPressed: onAction, child: Text(action!)),
        ],
      ),
    );
  }
}
