// The frame for every Auth screen: the shared hero on top, then a white card
// that holds the screen's own content. Screens pass only their content, so the
// card, spacing and corner radius are the same everywhere.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import 'auth_hero.dart';

/// The Auth frame: [hero] on top, then [children] inside the rounded card.
class AuthShell extends StatelessWidget {
  /// Creates the frame around the screen's [children].
  const AuthShell({super.key, required this.children, this.appBar});

  /// The screen's content, placed inside the card in order.
  final List<Widget> children;

  /// An optional app bar, used by Create account. Leave null for the hero look.
  final PreferredSizeWidget? appBar;

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
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                // Step 2: the photo and logo at the top.
                const AuthHero(),
                // Step 3: the white card that holds the content, pulled up over the photo.
                Transform.translate(
                  offset: const Offset(0, -IgongoSpace.lg),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: palette.surface,
                        borderRadius: BorderRadius.circular(IgongoRadius.lg),
                        border: Border.all(color: palette.border),
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
          ),
        ),
      ),
    );
  }
}
