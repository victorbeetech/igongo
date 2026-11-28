// The round radio mark at the end of a zone row: a red disc with a light centre when chosen, a grey ring when not.

import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The visual radio mark. The zone row around it handles taps.
class RefineRadioDot extends StatelessWidget {
  /// Creates the mark in its [selected] or unselected state.
  const RefineRadioDot({super.key, required this.selected});

  /// Whether this zone is the chosen one.
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(shape: BoxShape.circle, color: selected ? palette.primary : palette.border),
      // Step 1: a chosen mark shows a small light centre.
      child: selected
          ? Center(
              child: Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: palette.surface, shape: BoxShape.circle),
              ),
            )
          : null,
    );
  }
}
