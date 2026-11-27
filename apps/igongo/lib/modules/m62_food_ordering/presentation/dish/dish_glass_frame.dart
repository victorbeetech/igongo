// The round frosted frame behind the buttons that float over the dish photo.
// Any button can sit inside it (the Back arrow uses Flutter's BackButton so
// screen readers and tests know it is the Back control).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A round, bordered, lightly frosted frame at least the minimum touch size.
class DishGlassFrame extends StatelessWidget {
  /// Creates the frame around [child].
  const DishGlassFrame({super.key, required this.child});

  /// The button inside the frame.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface.withValues(alpha: 0.9),
      shape: CircleBorder(side: BorderSide(color: palette.border)),
      child: SizedBox(width: IgongoTouch.minimum, height: IgongoTouch.minimum, child: child),
    );
  }
}
