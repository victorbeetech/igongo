// Showcase: status chips in every tone. Each carries a dot and a word, never colour alone.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/ui/chip/status_chip.dart';
import '../showcase_section.dart';

/// One chip per status tone.
class ChipSection extends StatelessWidget {
  /// Creates the section.
  const ChipSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShowcaseSection(
      title: 'Status chips',
      children: [
        Wrap(
          spacing: IgongoSpace.sm,
          runSpacing: IgongoSpace.sm,
          children: [
            StatusChip('Paid'),
            StatusChip('Pending'),
            StatusChip('Blocked'),
            StatusChip('Scheduled'),
            StatusChip('Archived'),
          ],
        ),
      ],
    );
  }
}
