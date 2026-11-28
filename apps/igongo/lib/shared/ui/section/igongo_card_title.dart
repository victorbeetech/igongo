// The title row at the top of a card: a small icon, then the card's name.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A card heading with an icon, such as "Personal Information".
class IgongoCardTitle extends StatelessWidget {
  /// Creates a heading. [iconColor] defaults to Igongo red.
  const IgongoCardTitle({super.key, required this.icon, required this.title, this.iconColor});

  /// The icon before the title.
  final IconData icon;

  /// The card's name.
  final String title;

  /// The icon's colour; Igongo red when null.
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      spacing: 8,
      children: [
        Icon(icon, size: 20, color: iconColor ?? p.primary),
        Expanded(child: Text(title, style: context.text.titleSmall)),
      ],
    );
  }
}
