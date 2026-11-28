// One row of a list on My profile: a round icon disc, a title and an optional
// subtitle, an optional trailing widget (such as a badge) and a chevron. The
// disc colours come from the row's tone.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'profile_row_tone.dart';

/// A tappable row with an icon disc, a title and a chevron.
class ProfileActionRow extends StatelessWidget {
  /// Creates a row. Give [onTap] to make it tappable; without it the row is inert.
  const ProfileActionRow({
    super.key,
    required this.title,
    required this.icon,
    this.onTap,
    this.subtitle,
    this.trailing,
    this.tone = ProfileRowTone.soft,
    this.chevron = true,
  });

  /// The row's words, such as "Folio & Digital Invoices".
  final String title;

  /// The icon in the round disc.
  final IconData icon;

  /// What happens on tap, or null for a row with nothing to open yet.
  final VoidCallback? onTap;

  /// A line of smaller words under the title, such as "UGX Billing & Statements".
  final String? subtitle;

  /// A widget shown before the chevron, such as a badge or a count.
  final Widget? trailing;

  /// The colour family of the icon disc.
  final ProfileRowTone tone;

  /// Whether to show the chevron on the right.
  final bool chevron;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the disc fill, icon colour and title colour, by the row's tone.
    final (discFill, discInk, titleInk) = switch (tone) {
      ProfileRowTone.solid => (p.primary, p.onPrimary, p.text),
      ProfileRowTone.soft => (p.primaryContainer, p.primaryText, p.text),
      ProfileRowTone.neutral => (p.surfaceAlt, p.textMuted, p.text),
      ProfileRowTone.danger => (p.error.withValues(alpha: 0.1), p.error, p.error),
    };
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          // Step 2: a comfortable tap target, with the icon, words and extras in one line.
          padding: const EdgeInsets.all(IgongoSpace.md),
          child: Row(
            spacing: IgongoSpace.md,
            children: [
              // Step 3: the rounded icon disc.
              Container(
                width: 36,
                height: 36,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: discFill, borderRadius: BorderRadius.circular(IgongoRadius.md)),
                child: Icon(icon, size: 18, color: discInk),
              ),
              // Step 4: the title and subtitle fill the middle.
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: context.text.titleSmall?.copyWith(color: titleInk),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (subtitle != null)
                      Text(subtitle!, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
              // Step 5: the trailing widget and the chevron.
              ?trailing,
              if (chevron) Icon(Icons.chevron_right, size: 20, color: p.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
