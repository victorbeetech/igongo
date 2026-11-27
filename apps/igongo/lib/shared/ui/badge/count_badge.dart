// A small round count on top of an icon (the cart count). It hides at zero.
// The colours are passed in from the theme, so screens never pick their own.

import 'package:material_ui/material_ui.dart';

/// [child] with a count badge on its corner.
class CountBadge extends StatelessWidget {
  /// Creates the badge around [child].
  const CountBadge({
    super.key,
    required this.count,
    required this.child,
    required this.background,
    required this.foreground,
  });

  /// The number shown; the badge hides when it is zero.
  final int count;

  /// The icon or widget the badge sits on.
  final Widget child;

  /// The badge's fill colour.
  final Color background;

  /// The number's colour.
  final Color foreground;

  @override
  Widget build(BuildContext context) => Badge(
    isLabelVisible: count > 0,
    label: Text('$count'),
    backgroundColor: background,
    textColor: foreground,
    child: child,
  );
}
