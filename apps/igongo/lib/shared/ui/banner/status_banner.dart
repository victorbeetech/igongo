// A full-width strip under the app bar: offline, client view or a tip.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import 'banner_tone.dart';

export 'banner_tone.dart';

/// A one-line banner with an icon, a message and an optional action.
class StatusBanner extends StatelessWidget {
  /// Creates a banner of [tone] with [message].
  const StatusBanner({super.key, required this.tone, required this.message, this.action, this.onAction});

  /// Which banner it is.
  final BannerTone tone;

  /// The message.
  final String message;

  /// The action's words, such as "Switch back".
  final String? action;

  /// What the action does.
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    // Step 1: colour and icon for the tone.
    final p = context.palette;
    final (colour, icon) = switch (tone) {
      BannerTone.offline => (p.warning, Icons.cloud_off_outlined),
      BannerTone.clientView => (p.info, Icons.visibility_outlined),
      BannerTone.info => (p.info, Icons.info_outline),
    };
    // Step 2: a tinted strip, announced to screen readers as it appears.
    return Semantics(
      liveRegion: true,
      child: Container(
        width: double.infinity,
        color: colour.withValues(alpha: 0.14),
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.xs),
        child: Row(
          spacing: IgongoSpace.sm,
          children: [
            Icon(icon, size: 18, color: colour),
            Expanded(
              child: Text(message, style: context.text.labelMedium?.copyWith(color: p.text)),
            ),
            if (action != null) TextButton(onPressed: onAction, child: Text(action!)),
          ],
        ),
      ),
    );
  }
}
