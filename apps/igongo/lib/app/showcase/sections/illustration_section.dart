// Showcase: the brand kit's state illustrations, in the tone each state uses.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../../../shared/ui/illustration/state_illustration.dart';
import '../showcase_section.dart';

/// Every state drawing with its name.
class IllustrationSection extends StatelessWidget {
  /// Creates the section.
  const IllustrationSection({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // The colour each drawing takes on the screens.
    final tones = {
      IllustrationKind.empty: p.textMuted,
      IllustrationKind.error: p.error,
      IllustrationKind.offline: p.warning,
      IllustrationKind.success: p.success,
      IllustrationKind.denied: p.warning,
      IllustrationKind.notFound: p.textMuted,
    };
    return ShowcaseSection(
      title: 'Illustrations',
      children: [
        Wrap(
          spacing: IgongoSpace.md,
          runSpacing: IgongoSpace.md,
          children: [
            for (final MapEntry(key: kind, value: colour) in tones.entries)
              Column(
                children: [
                  StateIllustration(kind, colour: colour, width: 100),
                  Text(kind.file, style: context.text.bodySmall),
                ],
              ),
          ],
        ),
      ],
    );
  }
}
