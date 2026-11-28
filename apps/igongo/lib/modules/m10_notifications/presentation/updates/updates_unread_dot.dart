// The small red dot that marks an update as unread, with a pale ring round it.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A red dot read aloud as "Unread".
class UpdatesUnreadDot extends StatelessWidget {
  /// Creates the dot.
  const UpdatesUnreadDot({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      label: 'Unread',
      child: Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: p.primary,
          shape: BoxShape.circle,
          border: Border.all(color: p.primaryContainer, width: 2),
        ),
      ),
    );
  }
}
