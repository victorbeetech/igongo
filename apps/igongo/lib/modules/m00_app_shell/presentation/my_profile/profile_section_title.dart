// A section title on My profile: a short red bar, then the words in small bold capitals.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The title of a group of rows, such as "Resort Activity".
class ProfileSectionTitle extends StatelessWidget {
  /// Creates the title.
  const ProfileSectionTitle(this.title, {super.key});

  /// The words shown after the bar.
  final String title;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      header: true,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm),
        child: Row(
          children: [
            // Step 1: the red bar marks the start of the title.
            Container(
              width: 6,
              height: 16,
              decoration: BoxDecoration(color: p.primary, borderRadius: BorderRadius.circular(3)),
            ),
            const SizedBox(width: IgongoSpace.sm),
            // Step 2: the words, in small bold capitals.
            Text(
              title.toUpperCase(),
              style: context.text.labelLarge?.copyWith(color: p.text, fontWeight: FontWeight.w700, letterSpacing: 1.2),
            ),
          ],
        ),
      ),
    );
  }
}
