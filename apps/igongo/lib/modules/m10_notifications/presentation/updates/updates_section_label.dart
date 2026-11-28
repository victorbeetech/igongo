// The small uppercase label for a timeline group ("Today", "Past Days"), with a
// hairline that runs to the right edge.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A group heading such as "Today" with a thin rule after it.
class UpdatesSectionLabel extends StatelessWidget {
  /// Creates the heading for [title].
  const UpdatesSectionLabel({super.key, required this.title});

  /// The heading text; shown in capitals.
  final String title;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      children: [
        // Step 1: the label in the brand red, in capitals with wide letter spacing.
        Text(
          title.toUpperCase(),
          style: context.text.labelSmall?.copyWith(
            color: p.primaryText,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(width: IgongoSpace.sm),
        // Step 2: the hairline fills the rest of the row.
        Expanded(child: Divider(color: p.border, height: 1, thickness: 1)),
      ],
    );
  }
}
