// The Sign Out confirmation: "Sign Out of Igongo?" with the guest chip, and two
// buttons. It closes with true when the person signs out, false otherwise.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../frame/account_dialog_frame.dart';
import '../frame/dialog_icon_badge.dart';
import 'guest_identity_chip.dart';

/// Asks the person to confirm signing out. Pops with true to sign out, or false to stay.
class SignOutDialog extends StatelessWidget {
  /// Creates the dialog for the signed-in person [name] and [email].
  const SignOutDialog({super.key, required this.name, required this.email});

  /// The person's name, shown in the chip.
  final String name;

  /// The person's email, shown in the chip.
  final String email;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    return AccountDialogFrame(
      onClose: () => Navigator.pop(context, false),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the icon, the title and the short explanation.
          Center(
            child: DialogIconBadge(
              icon: Icons.logout,
              iconColour: p.primary,
              background: p.primaryContainer,
              ring: p.accent.withValues(alpha: 0.2),
            ),
          ),
          Text('Sign Out of Igongo?', textAlign: TextAlign.center, style: t.headlineSmall),
          Text(
            'Are you sure you wish to end your session? You will need your email and password to get back into your stays, orders and dining privileges.',
            textAlign: TextAlign.center,
            style: t.bodyMedium?.copyWith(color: p.textMuted),
          ),
          // Step 2: who is signing out, and that their points stay safe.
          GuestIdentityChip(name: name, email: email),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shield_moon_outlined, size: 15, color: p.secondary),
              const SizedBox(width: IgongoSpace.xs),
              Flexible(
                child: Text(
                  'Your booked stays and points balance remain guarded',
                  textAlign: TextAlign.center,
                  style: t.bodySmall?.copyWith(color: p.textMuted),
                ),
              ),
            ],
          ),
          // Step 3: the two actions. Signing out is the main one; staying is the quiet one.
          IgongoButton(
            label: 'Yes, Sign Out',
            icon: Icons.logout,
            expand: true,
            onPressed: () => Navigator.pop(context, true),
          ),
          IgongoButton(
            label: 'Stay Signed In',
            variant: ButtonVariant.secondary,
            expand: true,
            onPressed: () => Navigator.pop(context, false),
          ),
          // Step 4: the closing line, as in the design.
          Text(
            '"Otahurire gye" — Safe travels across the rolling hills',
            textAlign: TextAlign.center,
            style: t.bodySmall?.copyWith(color: p.textMuted, fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }
}
