// The hotel banner at the top of My profile: a red panel with a wavy bottom
// edge and the title "My profile". Until the hotel sends its own photo, the
// panel is a red gradient placeholder of the same shape.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/wave/wave_edge_clipper.dart';

/// The red banner with the title and a wavy bottom edge.
class ProfileBanner extends StatelessWidget {
  /// Creates a banner [height] tall.
  const ProfileBanner({super.key, required this.height});

  /// The banner's height in logical pixels (the wave is part of it).
  final double height;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: clip the panel to its wavy bottom edge.
    return ClipPath(
      clipper: const WaveEdgeClipper(),
      child: SizedBox(
        height: height,
        // Step 2: the red fill (a placeholder until the hotel photo exists).
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [p.primary, p.primaryDark],
            ),
          ),
          child: Stack(
            children: [
              // Step 3: a faint building mark where the photo will go.
              Positioned(
                right: IgongoSpace.lg,
                top: IgongoSpace.xxl,
                child: ExcludeSemantics(child: Icon(Icons.apartment, size: 96, color: p.onPrimary.withValues(alpha: 0.18))),
              ),
              // Step 4: the title, under the status bar, with a short white rule beneath.
              Positioned(
                left: IgongoSpace.lg,
                right: IgongoSpace.lg,
                top: MediaQuery.paddingOf(context).top + IgongoSpace.lg,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Semantics(
                      header: true,
                      child: Text('My profile', style: context.text.displaySmall?.copyWith(color: p.onPrimary)),
                    ),
                    const SizedBox(height: IgongoSpace.xs),
                    Container(width: 48, height: 3, color: p.onPrimary),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
