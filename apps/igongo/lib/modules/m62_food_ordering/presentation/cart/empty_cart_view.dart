// The empty cart: the trolley drawing, a friendly message, a Browse Services
// button, and four popular service cards that open their screens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../app/navigation/open_target.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../domain/cart_content.dart';
import 'cart_illustration.dart';
import 'popular_service_card.dart';

/// Fills the cart area when no item has been added yet.
class EmptyCartView extends StatelessWidget {
  /// Creates the empty state.
  const EmptyCartView({super.key});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, 0),
    child: Column(
      children: [
        // Step 1: the drawing, the friendly message and the way to start.
        const CartIllustration(),
        const SizedBox(height: IgongoSpace.md),
        Text('Your cart is empty', style: context.text.headlineSmall, textAlign: TextAlign.center),
        const SizedBox(height: IgongoSpace.xs),
        Text(
          'Explore our services and add something wonderful to your cart.',
          style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: IgongoSpace.lg),
        IgongoButton(
          label: 'Browse Services',
          icon: Icons.arrow_forward,
          expand: true,
          onPressed: () => openTarget(context, 'S62-01'),
        ),
        const SizedBox(height: IgongoSpace.xl),
        // Step 2: the popular services, two by two, each with its photo.
        Align(
          alignment: Alignment.centerLeft,
          child: Text('Popular services', style: context.text.titleMedium),
        ),
        const SizedBox(height: IgongoSpace.sm),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: IgongoSpace.md,
          crossAxisSpacing: IgongoSpace.md,
          childAspectRatio: 1.25,
          children: [for (final s in popularServices) PopularServiceCard(service: s)],
        ),
      ],
    ),
  );
}
