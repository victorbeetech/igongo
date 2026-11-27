// The small red line of text above a title. It can have short rules on either
// side, as on the first screen, or stand alone.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A short upper-case line of red text, optionally flanked by rules.
class OnboardingEyebrow extends StatelessWidget {
  /// Creates the eyebrow with [text]. Set [flanked] to draw a rule on each side.
  const OnboardingEyebrow({super.key, required this.text, this.flanked = true});

  /// The words, shown in upper case.
  final String text;

  /// Whether a short rule sits on each side of the words.
  final bool flanked;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the words in the small label size, in the brand red.
    final label = Text(
      text.toUpperCase(),
      textAlign: TextAlign.center,
      style: context.text.labelLarge?.copyWith(color: p.primaryText),
    );
    if (!flanked) return label;
    // Step 2: two short rules, each a token-sized line, either side of the words.
    final rule = Container(width: IgongoSpace.xl, height: IgongoSpace.xxs, color: p.primary);
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: IgongoSpace.sm,
      children: [rule, label, rule],
    );
  }
}
