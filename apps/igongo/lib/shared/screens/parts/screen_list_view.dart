// The scrolling body every shared layout uses, with the same padding at the
// bottom so the last item clears the navigation bar.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// A scrolling column of [children].
class ScreenListView extends StatelessWidget {
  /// Creates the scrolling body.
  const ScreenListView({super.key, required this.children});

  /// The sections of the screen, top to bottom.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.only(bottom: IgongoSpace.xxl),
    children: children,
  );
}
