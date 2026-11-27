// The small line at the foot of an onboarding screen, with a short icon
// before it, naming the hotel or the places it covers.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A centred caption line with an icon.
class OnboardingFooter extends StatelessWidget {
  /// Creates the footer with [text] and an optional [icon].
  const OnboardingFooter({super.key, required this.text, this.icon = Icons.verified});

  /// The words of the footer.
  final String text;

  /// The icon before the words.
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the icon and the caption, side by side, in the muted caption style.
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      spacing: IgongoSpace.xs,
      children: [
        Icon(icon, size: IgongoSpace.lg, color: p.primary),
        Flexible(child: Text(text, textAlign: TextAlign.center, style: context.text.bodySmall)),
      ],
    );
  }
}
