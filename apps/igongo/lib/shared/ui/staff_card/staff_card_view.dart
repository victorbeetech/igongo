// The staff card as the holder sees it: the default black portrait card from
// the brand kit, front and back. Tap to turn it over.

import 'package:igongo_brand/igongo_brand.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// The black portrait staff card, which turns over on tap.
class StaffCardView extends StatefulWidget {
  /// Creates the card at the given [width].
  const StaffCardView({super.key, this.width = 220});

  /// The card width; the height follows the CR80 card shape.
  final double width;

  @override
  State<StaffCardView> createState() => _StaffCardViewState();
}

class _StaffCardViewState extends State<StaffCardView> {
  // Whether the back (with the QR code) is showing.
  bool _back = false;

  @override
  Widget build(BuildContext context) {
    // Step 1: the side to show, from the brand kit's own card files.
    final file = _back ? BrandAssets.cardBack : BrandAssets.cardFront;
    // Step 2: a cross-fade between sides, with a label for screen readers.
    return Semantics(
      button: true,
      label: _back ? 'Staff card, back. Tap to see the front' : 'Staff card, front. Tap to see the back',
      child: GestureDetector(
        onTap: () => setState(() => _back = !_back),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 320),
          // A thin border keeps the black card's edge visible on the dark background.
          child: Container(
            key: ValueKey(file),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(IgongoRadius.md),
              border: Border.all(color: context.palette.border),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(IgongoRadius.md),
              child: Image.asset(file, package: BrandAssets.package, width: widget.width),
            ),
          ),
        ),
      ),
    );
  }
}
