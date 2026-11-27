// The logo slot on the Google and Apple buttons. Until the official logo files
// are added (see docs/NEEDS-YOU.md), it shows a neutral square with the
// provider's first letter. Later the square is replaced by the logo, in one place.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A small square logo slot for a sign-in provider, drawn as a placeholder for now.
class ProviderLogoSlot extends StatelessWidget {
  /// Creates the slot for [method], the server's key (`google` or `apple`).
  const ProviderLogoSlot({super.key, required this.method});

  /// The server's key for the provider; picks the placeholder letter.
  final String method;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the placeholder letter for this provider.
    final letter = method == 'apple' ? 'A' : 'G';
    // Step 2: the neutral square. Excluded from screen readers, because the button's label already says the name.
    return ExcludeSemantics(
      child: SizedBox(
        width: 18,
        height: 18,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: palette.surfaceAlt,
            borderRadius: BorderRadius.circular(IgongoRadius.sm),
            border: Border.all(color: palette.border),
          ),
          child: Center(
            child: Text(letter, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
          ),
        ),
      ),
    );
  }
}
