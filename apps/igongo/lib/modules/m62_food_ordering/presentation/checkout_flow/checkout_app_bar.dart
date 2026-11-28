// The header shared by every checkout and order-tracking screen: a back
// button, the hotel name in small caps, and the screen title in the brand serif.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'checkout_placeholders.dart';

/// A two-line app bar: hotel name above the screen title, with a back button.
class CheckoutAppBar extends StatelessWidget implements PreferredSizeWidget {
  /// Creates the bar with [title]. [actions] appear on the right (optional).
  const CheckoutAppBar({super.key, required this.title, this.actions = const []});

  /// The screen title shown under the hotel name.
  final String title;

  /// Icons shown on the right of the bar (optional).
  final List<Widget> actions;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 12);

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppBar(
      backgroundColor: palette.background,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: true,
      // Step 1: the back button, sized for a thumb and labelled for screen readers.
      leading: IconButton(
        tooltip: 'Back',
        icon: Icon(Icons.arrow_back, color: palette.primary),
        onPressed: () => Navigator.of(context).maybePop(),
      ),
      actions: actions,
      // Step 2: hotel name above the title, both centred.
      title: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            kHotelName.toUpperCase(),
            style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.4),
          ),
          Text(
            title,
            style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand),
          ),
        ],
      ),
    );
  }
}
