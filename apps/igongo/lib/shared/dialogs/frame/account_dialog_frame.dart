// The shared frame for the account dialogs (sign out, delete account): a centred
// rounded card in the theme's surface colour, with an optional close button at
// the top right. The content scrolls if the phone is short or text is large.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A centred card for an account dialog. Pass [onClose] to show the round close button.
class AccountDialogFrame extends StatelessWidget {
  /// Creates the frame around [child].
  const AccountDialogFrame({super.key, required this.child, this.onClose});

  /// The dialog's content.
  final Widget child;

  /// Closes the dialog. Null hides the close button.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Dialog(
      // Step 1: the Material dialog is transparent, so only our card shows.
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.all(IgongoSpace.lg),
      child: Container(
        // Step 2: the card, with a soft edge in the theme's border colour.
        constraints: const BoxConstraints(maxWidth: 420),
        padding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.sm, IgongoSpace.xl, IgongoSpace.xl),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          border: Border.all(color: p.border),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Step 3: the close button, top right, with a full-size tap area.
            if (onClose != null)
              Align(
                alignment: AlignmentDirectional.centerEnd,
                child: IconButton(
                  tooltip: 'Close',
                  onPressed: onClose,
                  icon: Icon(Icons.close, color: p.textMuted),
                ),
              ),
            // Step 4: the content, scrolling when it is taller than the screen.
            Flexible(child: SingleChildScrollView(child: child)),
          ],
        ),
      ),
    );
  }
}
