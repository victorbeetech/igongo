// The hotel banner at the top of the Me tab: the hotel photo under a red wash,
// with the dot and horn pattern, the title "Guest Profile" and two round
// buttons (theme and text size). It is flat-edged, as in the design, and runs
// under the status bar, so it is the screen's app bar for a guest.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/guest_photos.dart';
import 'profile_banner_pattern.dart';
import 'profile_header_button.dart';

/// The red banner with the title and the two header buttons.
class ProfileBanner extends StatelessWidget {
  /// Creates a banner [height] tall, including the status bar area.
  const ProfileBanner({super.key, required this.height, required this.onToggleTheme, required this.onTextSize});

  /// The banner's height in logical pixels, status bar included.
  final double height;

  /// Flips between light and dark mode (the moon button).
  final VoidCallback onToggleTheme;

  /// Opens the text size screen (the "Aa" button).
  final VoidCallback onTextSize;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final statusBar = MediaQuery.paddingOf(context).top;
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Step 1: the hotel photo, cropped to fill; the red behind it shows if it cannot load.
          DecoratedBox(
            decoration: BoxDecoration(color: p.primaryDark),
            child: Image.asset(
              GuestPhotos.banner,
              fit: BoxFit.cover,
              alignment: GuestPhotos.bannerAlignment,
              errorBuilder: (_, _, _) => const SizedBox.shrink(),
            ),
          ),
          // Step 2: a red wash, lighter at the top so the photo still shows, darker at the bottom.
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [p.primaryDark.withValues(alpha: 0.5), p.primaryDark.withValues(alpha: 0.85)],
              ),
            ),
          ),
          // Step 3: the dot grid and horns, drawn over the wash and ignoring touches.
          IgnorePointer(
            child: CustomPaint(painter: ProfileBannerPattern(ink: p.onPrimary)),
          ),
          // Step 4: the title on the left and the two buttons on the right, under the status bar.
          Padding(
            padding: EdgeInsets.fromLTRB(IgongoSpace.lg, statusBar + IgongoSpace.lg, IgongoSpace.lg, 0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Semantics(
                    header: true,
                    child: Text('Guest Profile', style: context.text.displaySmall?.copyWith(color: p.onPrimary)),
                  ),
                ),
                ProfileHeaderButton(
                  tooltip: 'Toggle light or dark mode',
                  icon: Icons.dark_mode_outlined,
                  onTap: onToggleTheme,
                ),
                const SizedBox(width: IgongoSpace.xs),
                ProfileHeaderButton(tooltip: 'Adjust text size', text: 'Aa', onTap: onTextSize),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
