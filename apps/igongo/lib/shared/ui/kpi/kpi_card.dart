// A dashboard number: a label and a big value in the brand display font.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../card/igongo_card.dart';

/// One dashboard number.
class KpiCard extends StatelessWidget {
  /// Creates a number card with its [label] and [value].
  const KpiCard({super.key, required this.label, required this.value, this.onTap});

  /// What the number is.
  final String label;

  /// The number, already formatted.
  final String value;

  /// What happens on tap, such as opening the list behind the number.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return IgongoCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.xs,
        children: [
          Text(label, style: context.text.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
          // Big numbers: the brand font at the headline size, as on the web.
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              style: context.text.displaySmall?.copyWith(
                fontSize: IgongoType.headline.size,
                color: context.palette.text,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
