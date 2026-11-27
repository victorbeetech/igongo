// The Food tab's top bar, drawn as one row in the red bar: the pin with the
// venue the order is for, a wish list (heart) button, and the WhatsApp chat
// button. The cart is not here, because the bottom bar already has Cart.
// The wish list is a placeholder until the API provides saved dishes.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/contact/whatsapp_chat_button.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// The Food tab's one-row top bar.
class FoodTopBar extends StatelessWidget {
  /// Creates the bar for [venue].
  const FoodTopBar({super.key, required this.venue});

  /// The venue the order is for, shown beside the pin.
  final String venue;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the red bar sits under the status bar (SafeArea) and holds one row.
    return ColoredBox(
      color: p.primary,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm),
          child: Row(
            children: [
              // Step 2: the pin and the venue name, cut short with dots if it is long.
              Icon(Icons.location_on_outlined, size: 18, color: p.onPrimary),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(
                child: Text(
                  'Cottage — • $venue',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700, color: p.onPrimary),
                ),
              ),
              // Step 3: the wish list heart (placeholder until saved dishes are wired).
              IconButton(
                tooltip: 'Wish list',
                onPressed: () => showIgongoToast(context, 'Wish list is coming soon.'),
                icon: Icon(Icons.favorite_border, color: p.onPrimary),
              ),
              // Step 4: the WhatsApp chat button, the same one the other guest screens use.
              const WhatsappChatButton(),
            ],
          ),
        ),
      ),
    );
  }
}
