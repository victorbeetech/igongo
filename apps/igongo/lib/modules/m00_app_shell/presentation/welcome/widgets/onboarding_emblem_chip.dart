// The Igongo logo in a small white rounded card, optionally with a short
// label after it, such as "Culture & Stay". Sits in a hero's top corner.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/logo/igongo_logo.dart';

/// The logo chip for a hero photo.
class OnboardingEmblemChip extends StatelessWidget {
  /// Creates the chip. [label] is optional.
  const OnboardingEmblemChip({super.key, this.label});

  /// Optional words shown after the logo, in the brand red.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: a white rounded card holding the logo, then the optional label.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.sm,
        children: [
          // Step 2: the horizontal logo, drawn from the brand kit, never redrawn.
          const IgongoLogo(shape: LogoShape.horizontal, height: 28),
          if (label != null) Text(label!, style: context.text.labelLarge?.copyWith(color: p.primaryText)),
        ],
      ),
    );
  }
}
