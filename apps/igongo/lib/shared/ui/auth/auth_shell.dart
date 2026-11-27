// The frame for every Auth screen: the shared hero on top, then a white card
// that holds the screen's own content. Screens pass only their content, so the
// card, spacing and corner radius are the same everywhere. A screen that needs
// to go back can show a back pill over the photo instead of an app bar.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import 'auth_hero.dart';

/// The Auth frame: [hero] on top, then [children] inside the rounded card.
class AuthShell extends StatelessWidget {
  /// Creates the frame around the screen's [children]. Pass [onBack] to show a back pill over the photo.
  const AuthShell({super.key, required this.children, this.appBar, this.onBack});

  /// The screen's content, placed inside the card in order.
  final List<Widget> children;

  /// An optional app bar. Leave null for the hero look.
  final PreferredSizeWidget? appBar;

  /// Called when the back pill is tapped. Null hides the pill.
  final VoidCallback? onBack;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      appBar: appBar,
      // Step 1: keep the content a readable width on tablets and the web.
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            // Step 2: the scrolling content, with the back pill (if any) laid over the top of it.
            child: Stack(
              fit: StackFit.expand,
              children: [
                ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    // Step 2a: the photo and logo at the top.
                    const AuthHero(),
                    // Step 2b: the white card that holds the content, pulled up over the photo.
                    Transform.translate(
                      offset: const Offset(0, -IgongoSpace.lg),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
                        // A Material surface, so list tiles inside the card (such as the privacy checkbox) get their ink.
                        child: Material(
                          color: palette.surface,
                          clipBehavior: Clip.antiAlias,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(IgongoRadius.lg),
                            side: BorderSide(color: palette.border),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(IgongoSpace.lg),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              spacing: IgongoSpace.md,
                              children: children,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                // Step 3: the back pill sits over the photo, top left, only when a screen asks for it.
                if (onBack != null)
                  Positioned(
                    top: IgongoSpace.sm,
                    left: IgongoSpace.md,
                    child: _BackPill(onBack: onBack!),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A small rounded "Back" button drawn over the hero photo.
class _BackPill extends StatelessWidget {
  /// Creates the pill; [onBack] runs on tap.
  const _BackPill({required this.onBack});

  /// Called when the pill is tapped.
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface,
      shape: const StadiumBorder(),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onBack,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.xs),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: IgongoSpace.xs,
            children: [
              // The arrow and the word together, so screen readers say "Back".
              Icon(Icons.arrow_back, size: 18, color: palette.primaryText),
              Text('Back', style: context.text.labelLarge?.copyWith(color: palette.primaryText)),
            ],
          ),
        ),
      ),
    );
  }
}
