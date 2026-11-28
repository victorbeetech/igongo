// The footer of My profile: the hotel's heritage quote and the app's name and version.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The centred quote and the hotel line at the bottom of the screen.
class ProfileFooter extends StatelessWidget {
  /// Creates the footer.
  const ProfileFooter({super.key});

  // PLACEHOLDER: the version is not read from the build yet.
  static const _version = 'v—';

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.xl, IgongoSpace.lg, IgongoSpace.xl),
      child: Column(
        children: [
          Text(
            '"Where the past meets the present in royal Ankole grace."',
            style: context.text.bodySmall?.copyWith(fontStyle: FontStyle.italic),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            'Igongo Country Hotel & Cultural Centre • $_version',
            style: context.text.labelSmall?.copyWith(color: p.textMuted),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
