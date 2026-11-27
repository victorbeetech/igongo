// A placeholder for a value the API does not provide yet (a rating, opening
// hours, a prep time, a cottage number). It shows a muted dash, so the design's
// layout is in place without a made-up fact reaching a guest. Replace it with
// the real value when the API has one.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A muted dash (or the given [text]), optionally with a leading [icon].
class PlaceholderValue extends StatelessWidget {
  /// Creates the placeholder. [text] defaults to a dash.
  const PlaceholderValue({super.key, this.icon, this.text = '—'});

  /// The small icon before the value, or null for none.
  final IconData? icon;

  /// The text shown, a dash until the value exists.
  final String text;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final style = context.text.labelSmall?.copyWith(color: p.textMuted);
    // Step 1: the optional icon, then the muted text.
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[Icon(icon, size: 14, color: p.textMuted), const SizedBox(width: 2)],
        Text(text, style: style),
      ],
    );
  }
}
