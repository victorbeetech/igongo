// A small rounded label used on booking cards (for example "Popular" or
// "Gentle hill trail"). Two tones: a soft tint and a solid red for badges.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// A pill-shaped label with [text].
class FlowTag extends StatelessWidget {
  /// Creates a tag. Set [solid] for the red badge style.
  const FlowTag(this.text, {super.key, this.solid = false});

  /// The words shown in the tag.
  final String text;

  /// True for the solid red badge, false for the soft tint.
  final bool solid;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: pick the colours for the tone.
    final background = solid ? palette.primary : palette.primaryContainer;
    final foreground = solid ? palette.onPrimary : palette.primary;
    // Step 2: the padded pill with the label.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
      child: Text(text, style: context.text.labelSmall?.copyWith(color: foreground)),
    );
  }
}
