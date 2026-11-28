// The footer of the Updates screen: the link to notification preferences and the
// concierge line under it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_pill_button.dart';

/// The preferences link and the concierge line, centred at the foot of the list.
class UpdatesFooter extends StatelessWidget {
  /// Creates the footer.
  const UpdatesFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.only(top: IgongoSpace.xl, left: IgongoSpace.lg, right: IgongoSpace.lg),
      child: Column(
        children: [
          // Step 1: the preferences link. Its screen is wired later.
          UpdatesPillButton(
            label: 'Manage notification preferences',
            leading: Icons.tune,
            background: p.surfaceAlt,
            foreground: p.textMuted,
            onPressed: () {},
          ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: the concierge line.
          Text(
            'Need immediate assistance? Concierge is online 24/7.',
            textAlign: TextAlign.center,
            style: context.text.labelSmall?.copyWith(color: p.textMuted),
          ),
        ],
      ),
    );
  }
}
