// The chip in the sign-out dialog: the person's initials, name and email, and
// the points balance kept safe on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/initials.dart';
import '../../theme/theme.dart';

/// Shows who is signing out and reassures them their points are kept.
class GuestIdentityChip extends StatelessWidget {
  /// Creates the chip for [name] and [email].
  const GuestIdentityChip({super.key, required this.name, required this.email});

  /// The person's name.
  final String name;

  /// The person's sign-in email (may be empty).
  final String email;

  // PLACEHOLDER: the points balance comes from the API later. A dash shows until then; no balance is committed.
  static const _pointsPlaceholder = '— Pts';

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    final initials = initialsOf(name);
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        children: [
          // Step 1: the initials in a red disc, then the name and email.
          CircleAvatar(
            radius: 20,
            backgroundColor: p.primary,
            child: Text(initials, style: t.labelMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: t.labelLarge, maxLines: 1, overflow: TextOverflow.ellipsis),
                if (email.isNotEmpty)
                  Text(
                    email,
                    style: t.bodySmall?.copyWith(color: p.textMuted),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
          ),
          const SizedBox(width: IgongoSpace.sm),
          // Step 2: the points, with the reassurance under them.
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(_pointsPlaceholder, style: t.labelMedium?.copyWith(color: p.secondary, fontWeight: FontWeight.w700)),
              Text('Securely Saved', style: t.bodySmall?.copyWith(color: p.textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}
