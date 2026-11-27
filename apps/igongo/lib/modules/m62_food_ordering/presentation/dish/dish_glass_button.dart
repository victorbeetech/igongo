// A round icon button that floats over the dish photo (favourite, share).
// It sits inside a DishGlassFrame, so it matches the Back button.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'dish_glass_frame.dart';

/// One round icon button over the photo (disabled while its feature is not wired).
class DishGlassButton extends StatelessWidget {
  /// Creates the button. A null [onPressed] shows it disabled.
  const DishGlassButton({super.key, required this.icon, required this.tooltip, this.onPressed});

  /// The icon shown.
  final IconData icon;

  /// What a screen reader says, and the hover hint.
  final String tooltip;

  /// What happens on tap; null disables the button.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => Tooltip(
    message: tooltip,
    child: DishGlassFrame(
      child: IconButton(
        icon: Icon(icon, size: 20, color: context.palette.text),
        onPressed: onPressed,
      ),
    ),
  );
}
