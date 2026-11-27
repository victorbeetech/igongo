// The profile card that overlaps the banner: the avatar, name, email, the
// account pill and the Edit button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'profile_avatar.dart';
import 'profile_pill.dart';

/// The signed-in person's card.
class ProfileCard extends StatelessWidget {
  /// Creates the card.
  const ProfileCard({
    super.key,
    required this.name,
    required this.email,
    required this.isStaff,
    required this.onEdit,
  });

  /// The person's name.
  final String name;

  /// The person's sign-in email (may be empty).
  final String email;

  /// True for staff accounts, which get a different label.
  final bool isStaff;

  /// Opens the account form.
  final VoidCallback onEdit;

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
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Step 2: avatar, then the words.
          ProfileAvatar(name: name),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(shown, style: context.text.titleLarge, maxLines: 2, overflow: TextOverflow.ellipsis),
                if (email.isNotEmpty)
                  Text(email, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: IgongoSpace.sm),
                ProfilePill(icon: Icons.person, label: isStaff ? 'Staff account' : 'Guest account', fill: p.primary, foreground: p.onPrimary),
              ],
            ),
          ),
          // Step 3: the Edit button opens the account form.
          ProfilePill(icon: Icons.edit_outlined, label: 'Edit', onTap: onEdit),
        ],
      ),
    );
  }
}
