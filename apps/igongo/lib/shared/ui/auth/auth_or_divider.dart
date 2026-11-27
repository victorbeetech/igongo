// The "or" line between the email form and the Google and Apple buttons.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A thin line, the word "or", then another thin line.
class AuthOrDivider extends StatelessWidget {
  /// Creates the divider.
  const AuthOrDivider({super.key});

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(child: Divider(color: context.palette.border)),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Text('or', style: context.text.bodySmall?.copyWith(color: context.palette.textMuted)),
      ),
      Expanded(child: Divider(color: context.palette.border)),
    ],
  );
}
