// The square tick box at the end of an amenity row: red with a white tick when on, grey and empty when off.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The visual tick box. It shows the state only; the row around it handles taps.
class RefineCheckBox extends StatelessWidget {
  /// Creates the box in its [on] or off state.
  const RefineCheckBox({super.key, required this.on});

  /// Whether the box is ticked.
  final bool on;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: on ? palette.primary : palette.surfaceAlt,
        borderRadius: BorderRadius.circular(IgongoRadius.sm),
      ),
      child: on ? Icon(Icons.check, size: 18, color: palette.onPrimary) : null,
    );
  }
}
