// S16-19 My card: the holder's own staff card, the default black portrait
// design, with its status and what it opens. Signed in, the facts are live
// from the API; signed out, the prototype's sample facts show.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/dialog_buttons.dart';
import '../../../../shared/screens/parts/link_rows.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/staff_card/staff_card_view.dart';
import '../../application/card_providers.dart';
import '../../domain/my_card.dart';

/// The holder's own staff card.
class MyCardScreen extends ConsumerWidget {
  /// Creates the card screen for [screen].
  const MyCardScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<MyCard>(
    screenName: screen.spec.name,
    value: ref.watch(myCardProvider),
    onRetry: () => ref.invalidate(myCardProvider),
    sample: _sample,
    builder: (context, card, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        const Padding(
          padding: EdgeInsets.all(IgongoSpace.xl),
          child: Center(child: StaffCardView()),
        ),
        const SectionHeader('This card'),
        IgongoListRow(title: card.holder.name, subtitle: card.holder.line, leading: const Icon(Icons.badge_outlined)),
        if (card.cardNumber == null)
          const IgongoListRow(
            title: 'No card yet',
            subtitle: 'Ask HR to issue your card.',
            leading: Icon(Icons.info_outline),
          )
        else
          IgongoListRow(
            title: 'Card ${card.cardNumber}',
            subtitle: card.cardType,
            status: card.status == 'active' ? 'Active' : 'Lost',
            leading: const Icon(Icons.contactless_outlined),
          ),
      ],
    ),
  );

  /// The prototype design, with sample facts.
  Widget _sample(BuildContext context) => ScreenListView(
    children: [
      PurposeText(screen.spec.purpose),
      // Step 1: the card itself; tap to turn it over to the QR side.
      const Padding(
        padding: EdgeInsets.all(IgongoSpace.xl),
        child: Center(child: StaffCardView()),
      ),
      Center(child: Text('Tap the card to see the back', style: context.text.bodySmall)),
      // Step 2: the card's facts.
      const SectionHeader('This card'),
      const IgongoListRow(
        title: 'Card 0148',
        subtitle: 'NTAG213 · issued 3 Feb 2026',
        status: 'Active',
        leading: Icon(Icons.contactless_outlined),
      ),
      const IgongoListRow(
        title: 'Opens',
        subtitle: 'Main gate, staff canteen, front office',
        leading: Icon(Icons.door_front_door_outlined),
      ),
      const Padding(
        padding: EdgeInsets.all(IgongoSpace.lg),
        child: Align(alignment: Alignment.centerLeft, child: StatusChip('Active')),
      ),
      LinkRows(screen),
      DialogButtons(screen),
    ],
  );
}
