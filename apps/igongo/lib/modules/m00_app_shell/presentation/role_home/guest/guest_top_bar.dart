// The top row of the guest home: the greeting (time of day and first name), the place,
// then the search and bell round buttons. The WhatsApp button floats at the bottom (see the app shell).
// Colours and text sizes come from the theme tokens only.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/clock/app_clock.dart';
import '../../../../../shared/format/greeting.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/icons/round_icon_button.dart';

/// The guest home's top row. [name] is the signed-in guest's, or null when signed out.
class GuestTopBar extends ConsumerWidget {
  /// Creates the top row; [onBell] opens the notification inbox and [onSearch] opens search.
  const GuestTopBar({super.key, this.name, required this.onBell, required this.onSearch});

  /// The guest's name, shown after the greeting.
  final String? name;

  /// Called when the bell is tapped.
  final VoidCallback onBell;

  /// Called when the search button is tapped.
  final VoidCallback onSearch;

  /// Where the hotel is, shown under the greeting.
  static const hotelPlace = 'Mbarara, Uganda';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    // Step 1: the time now, from the app clock (pinned in tests).
    final now = ref.watch(clockProvider)();
    return Row(
      children: [
        // Step 2: the greeting on one line (cut with an ellipsis if long), then the place.
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                greetingFor(now, name),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: context.text.titleLarge?.copyWith(color: p.primary, fontWeight: FontWeight.w700),
              ),
              Row(
                children: [
                  Icon(Icons.location_on, size: IgongoSpace.md, color: p.primaryText),
                  const SizedBox(width: IgongoSpace.xxs),
                  Text(hotelPlace, style: context.text.labelSmall?.copyWith(color: p.textMuted)),
                ],
              ),
            ],
          ),
        ),
        // Step 3: the search button and the bell, on the right, the same round style.
        RoundIconButton(icon: Icons.search, tooltip: 'Search', onPressed: onSearch),
        const SizedBox(width: IgongoSpace.sm),
        RoundIconButton(icon: Icons.notifications_none, tooltip: 'Notifications', showDot: true, onPressed: onBell),
      ],
    );
  }
}
