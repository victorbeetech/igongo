// The notice at the top of the food shop while the demo menu shows, so no
// one mistakes sample dishes for the real menu.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../../../shared/ui/card/igongo_card.dart';

/// A card saying the dishes below are a demo and cannot be ordered.
class DemoNotice extends StatelessWidget {
  /// Creates the notice.
  const DemoNotice({super.key});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
    child: IgongoCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Text(
              'Demo menu: sample dishes. You can order them to try the flow, but nothing is sent to the kitchen or charged.',
              style: context.text.bodySmall,
            ),
          ),
        ],
      ),
    ),
  );
}
