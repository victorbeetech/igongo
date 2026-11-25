// The line under a screen title that says what the screen is for.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// The purpose line at the top of a screen.
class PurposeText extends StatelessWidget {
  /// Creates the line with [text].
  const PurposeText(this.text, {super.key});

  /// What the screen is for.
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, IgongoSpace.xs),
    child: Text(text, style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted)),
  );
}
