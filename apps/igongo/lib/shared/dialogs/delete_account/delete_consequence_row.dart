// One line in the delete-account list: a small red icon and the consequence text.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A consequence of deleting the account, with a small icon in front.
class DeleteConsequenceRow extends StatelessWidget {
  /// Creates the row.
  const DeleteConsequenceRow({super.key, required this.icon, required this.text});

  /// The icon at the start of the row.
  final IconData icon;

  /// What is lost.
  final String text;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Step 1: the icon sits in a soft red disc.
        Container(
          width: 22,
          height: 22,
          alignment: Alignment.center,
          decoration: BoxDecoration(shape: BoxShape.circle, color: p.error.withValues(alpha: 0.12)),
          child: Icon(icon, size: 14, color: p.error),
        ),
        const SizedBox(width: IgongoSpace.sm),
        // Step 2: the text beside it.
        Expanded(child: Text(text, style: context.text.bodySmall)),
      ],
    );
  }
}
