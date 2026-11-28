// The Stay & Culinary Preferences card: what the guest likes, and their allergies
// and dietary notes, which the chef is told about.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';
import '../../../../../shared/ui/field/igongo_hint_field.dart';
import '../../../../../shared/ui/section/igongo_card_title.dart';

/// The stay and food preferences group.
class PreferencesCard extends StatelessWidget {
  /// Creates the card from the two text controllers.
  const PreferencesCard({super.key, required this.likes, required this.allergies});

  /// Holds what the guest likes.
  final TextEditingController likes;

  /// Holds allergies and dietary notes.
  final TextEditingController allergies;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.lg,
        children: [
          IgongoCardTitle(icon: Icons.room_service_outlined, title: 'Stay & Culinary Preferences', iconColor: p.accent),
          IgongoHintField(
            label: 'What I like',
            placeholder: 'Tell our concierge what makes your stay comfortable...',
            controller: likes,
            lines: 3,
          ),
          IgongoHintField(
            label: 'Allergies & Dietary Notes',
            hint: 'Chef notified',
            placeholder: 'E.g., No shellfish, lactose intolerant, vegan...',
            controller: allergies,
            lines: 2,
          ),
        ],
      ),
    );
  }
}
