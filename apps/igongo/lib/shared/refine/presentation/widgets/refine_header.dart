// The top bar of the Filter & Refine sheet: a red dot, the title, Reset and a close button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The title row at the top of the Filter & Refine sheet.
class RefineHeader extends StatelessWidget {
  /// Creates the header. [onReset] restores the starting choices; [onClose] shuts the sheet.
  const RefineHeader({super.key, required this.onReset, required this.onClose});

  /// Called when Reset is tapped.
  final VoidCallback onReset;

  /// Called when the close button is tapped.
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Step 1: the red dot and the title.
        Row(
          spacing: IgongoSpace.sm,
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(color: palette.primary, shape: BoxShape.circle),
            ),
            Text('Filter & Refine', style: context.text.titleLarge),
          ],
        ),
        // Step 2: Reset and close, each with a tap area of at least 44 by 44.
        Row(
          children: [
            TextButton(
              onPressed: onReset,
              style: TextButton.styleFrom(
                foregroundColor: palette.primary,
                minimumSize: const Size(IgongoTouch.minimum, IgongoTouch.minimum),
              ),
              child: Text(
                'Reset',
                style: context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w600, color: palette.primary),
              ),
            ),
            SizedBox(
              width: IgongoTouch.minimum,
              height: IgongoTouch.minimum,
              child: Center(
                // The visible close button is 36 across; the tap area around it is 44.
                child: Material(
                  color: palette.surfaceAlt,
                  shape: const CircleBorder(),
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: onClose,
                    child: SizedBox(
                      width: 36,
                      height: 36,
                      child: Icon(Icons.close, size: 20, color: palette.textMuted),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
