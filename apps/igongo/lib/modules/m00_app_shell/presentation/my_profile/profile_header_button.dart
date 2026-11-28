// A round translucent button on the top-right of the Me banner, for the theme
// and text size. The visible disc is 36 pixels; the tap area is 48 so it stays
// easy to hit (see IgongoTouch.preferred).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A white-tinted round button with an icon or short text.
class ProfileHeaderButton extends StatelessWidget {
  /// Creates a button. Give exactly one of [icon] or [text].
  const ProfileHeaderButton({super.key, required this.tooltip, required this.onTap, this.icon, this.text})
    : assert((icon == null) != (text == null), 'Give exactly one of icon or text.');

  /// What the button does, read aloud and shown on long press.
  final String tooltip;

  /// What happens on tap.
  final VoidCallback onTap;

  /// The icon to show, if any.
  final IconData? icon;

  /// The short text to show instead of an icon, such as "Aa".
  final String? text;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the tap area, at least the minimum touch size.
    return Semantics(
      button: true,
      label: tooltip,
      child: Tooltip(
        message: tooltip,
        child: SizedBox(
          width: IgongoTouch.preferred,
          height: IgongoTouch.preferred,
          // Step 2: the visible disc, centred in the tap area.
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: onTap,
              child: Center(
                child: Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: p.onPrimary.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: p.onPrimary.withValues(alpha: 0.3)),
                  ),
                  // Step 3: the icon, or the short text, in white.
                  child: icon != null
                      ? Icon(icon, size: 18, color: p.onPrimary)
                      : Text(
                          text!,
                          style: context.text.labelLarge?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
