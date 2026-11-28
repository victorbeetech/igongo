// The Clear All button in the footer: a quiet grey button with a reset icon.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The quiet Clear All button.
class RefineClearButton extends StatelessWidget {
  /// Creates the button. [onPressed] clears the chosen filters.
  const RefineClearButton({super.key, required this.onPressed});

  /// Called when the button is tapped.
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surfaceAlt,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        onTap: onPressed,
        child: SizedBox(
          height: IgongoTouch.preferred,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 6,
            children: [
              Icon(Icons.restart_alt, size: 18, color: palette.text),
              Text(
                'Clear All',
                style: context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w600, color: palette.text),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
