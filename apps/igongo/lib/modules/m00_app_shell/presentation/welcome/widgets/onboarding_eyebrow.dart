// The small red line of text above a title. It can have short rules on both
// sides (centred, as on the first screen), a single rule before the words
// (left-aligned, as on the later screens), or stand alone.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A short upper-case line of red text, optionally with rules.
class OnboardingEyebrow extends StatelessWidget {
  /// Creates the eyebrow with [text].
  /// [flanked] draws a rule on each side (centred); [ruleBefore] draws one rule before the words (left).
  const OnboardingEyebrow({super.key, required this.text, this.flanked = true, this.ruleBefore = false});

  /// The words, shown in upper case.
  final String text;

  /// Whether a short rule sits on each side of the words.
  final bool flanked;

  /// Whether one short rule sits before the words, for a left-aligned eyebrow.
  final bool ruleBefore;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the words in the small label size, in the brand red.
    final label = Text(
      text.toUpperCase(),
      textAlign: ruleBefore ? TextAlign.start : TextAlign.center,
      style: context.text.labelLarge?.copyWith(color: p.primaryText),
    );
    // Step 2: one rule, a token-sized line, before the words for a left-aligned eyebrow.
    final rule = Container(width: IgongoSpace.xl, height: IgongoSpace.xxs, color: p.primary);
    if (ruleBefore) {
      return Row(spacing: IgongoSpace.sm, children: [rule, Flexible(child: label)]);
    }
    if (!flanked) return label;
    // Step 3: two short rules, either side of the words, for the centred eyebrow.
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: IgongoSpace.sm,
      children: [rule, label, rule],
    );
  }
}
