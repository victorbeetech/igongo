// The guest home's greeting: "Good morning, Victor" with the place underneath,
// and a round bell on the right. The greeting follows the time of day.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The time-of-day greeting, the signed-in person's first name and the place.
class GuestGreeting extends StatelessWidget {
  /// Creates the greeting; [name] is null when signed out.
  const GuestGreeting({super.key, this.name});

  /// The signed-in person's full name, or null.
  final String? name;

  /// Picks the greeting for the hour: morning before noon, afternoon before five, else evening.
  static String greetingFor(DateTime now) {
    if (now.hour < 12) return 'Good morning';
    if (now.hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the first name only, so the greeting stays one short line.
    final first = name?.trim().split(' ').first;
    final greeting = greetingFor(DateTime.now());
    final line = first == null || first.isEmpty ? greeting : '$greeting, $first';
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm),
      child: Row(
        children: [
          // Step 2: the greeting and the place, on the page background.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(line, style: context.text.titleLarge?.copyWith(color: p.text)),
                Text('Igongo, Mbarara', style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
              ],
            ),
          ),
          // Step 3: the round bell. Alerts are not in the app yet, so it is shown but cannot be pressed.
          Tooltip(
            message: 'Alerts',
            child: CircleAvatar(
              backgroundColor: p.surfaceAlt,
              child: Icon(Icons.notifications_none, color: p.primary),
            ),
          ),
        ],
      ),
    );
  }
}
