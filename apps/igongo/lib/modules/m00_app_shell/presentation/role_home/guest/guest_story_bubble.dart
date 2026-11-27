// One round "Happening today" bubble: a ring in the brand colours around a
// placeholder picture, with a short label under it. The picture is a placeholder
// until the hotel sends the real one.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// A story bubble: [icon] stands in for the picture, [label] sits under it.
class GuestStoryBubble extends StatelessWidget {
  /// Creates the bubble; [asset] is the demo picture's path (null shows the placeholder).
  const GuestStoryBubble({super.key, required this.icon, required this.label, this.asset});

  /// The demo picture's asset path, or null for the placeholder.
  final String? asset;

  /// The icon shown while the picture is a placeholder.
  final IconData icon;

  /// The words under the bubble.
  final String label;

  /// The diameter of the picture in logical pixels.
  static const _size = 56.0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SizedBox(
      width: _size + IgongoSpace.lg,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step 1: the ring, then a white gap, then the circular picture.
          Container(
            padding: const EdgeInsets.all(IgongoSpace.xxs),
            decoration: BoxDecoration(shape: BoxShape.circle, color: p.primary),
            child: Container(
              padding: const EdgeInsets.all(IgongoSpace.xxs),
              decoration: BoxDecoration(shape: BoxShape.circle, color: p.surface),
              child: ClipOval(
                child: SizedBox(
                  width: _size,
                  height: _size,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      GuestPhoto(asset: asset),
                      // Step 2: the play-style icon over the picture, centred.
                      Center(
                        child: Icon(icon, size: IgongoSpace.lg, color: p.primary),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: IgongoSpace.xs),
          // Step 3: the label, one line, cut with an ellipsis.
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: context.text.labelSmall?.copyWith(color: p.text),
          ),
        ],
      ),
    );
  }
}
