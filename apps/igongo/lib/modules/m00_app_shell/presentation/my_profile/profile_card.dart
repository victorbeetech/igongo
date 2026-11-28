// The profile card that overlaps the banner: the avatar, the name with a
// verified mark, the email, the account chip and room, and the Edit pill.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'profile_avatar.dart';
import 'profile_pill.dart';

/// The signed-in person's card.
class ProfileCard extends StatelessWidget {
  /// Creates the card.
  const ProfileCard({super.key, required this.name, required this.email, required this.isStaff, required this.onEdit});

  /// The person's name.
  final String name;

  /// The person's sign-in email (may be empty).
  final String email;

  /// True for staff accounts, which get a different label and no room line.
  final bool isStaff;

  /// Opens the account form.
  final VoidCallback onEdit;

  // PLACEHOLDER: the room number is not in the session yet. Replace the dash
  // with the guest's room once the stay is wired.
  static const _roomPlaceholder = '—';

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final shown = name.isEmpty ? 'Your account' : name;
    return Container(
      // Step 1: a white card with a soft edge, in the theme's surface colour.
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: p.border),
      ),
      child: Row(
        children: [
          // Step 2: the avatar, then the words.
          ProfileAvatar(name: name),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 2a: the name, with a verified mark beside it.
                Row(
                  children: [
                    Flexible(
                      child: Text(shown, style: context.text.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                    ),
                    const SizedBox(width: IgongoSpace.xs),
                  ],
                ),
                if (email.isNotEmpty)
                  Text(email, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: IgongoSpace.xs),
                // Step 2b: the account chip and, for a guest, the room.
                Row(
                  children: [
                    ProfilePill(
                      label: isStaff ? 'Staff account' : 'Guest account',
                      fill: p.surfaceAlt,
                      foreground: p.text,
                    ),
                    if (!isStaff) ...[
                      const SizedBox(width: IgongoSpace.xs),
                      Flexible(
                        child: Text(
                          '• Room $_roomPlaceholder',
                          style: context.text.labelSmall?.copyWith(color: p.textMuted),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          // Step 3: the Edit pill opens the account form.
          const SizedBox(width: IgongoSpace.sm),
          ProfilePill(
            icon: Icons.edit_outlined,
            label: 'Edit',
            onTap: onEdit,
            fill: p.surfaceAlt,
            foreground: p.primaryText,
          ),
        ],
      ),
    );
  }
}
