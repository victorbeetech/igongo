// The guest's "book" screen of any booking module (rooms, museum, events,
// pool, shop): everything on sale, live from the API. Tapping one opens the
// booking sheet. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../format/ugx.dart';
import '../../live/live_view.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';
import '../application/bookings_providers.dart';
import '../domain/booking_place.dart';
import '../domain/offering.dart';
import 'book_sheet.dart';

/// What [place] sells, to book.
class BookScreen extends ConsumerWidget {
  /// Creates the screen for [screen] at [place].
  const BookScreen(this.screen, this.place, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// The booking module.
  final BookingPlace place;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Offering>>(
    screenName: screen.spec.name,
    value: ref.watch(offeringsProvider(place)),
    onRetry: () => ref.invalidate(offeringsProvider(place)),
    sample: (_) => screenLayout(screen),
    builder: (context, offerings, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(offeringsProvider(place).future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (offerings.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('Nothing to book yet.')),
          for (final o in offerings)
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
              child: IgongoCard(
                onTap: () => showBookSheet(context, place, o),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    Text(o.name, style: context.text.titleMedium),
                    if (o.description case final d?) Text(d, maxLines: 3, overflow: TextOverflow.ellipsis),
                    Text(
                      o.kind == 'enquiry' ? 'Ask for a price' : '${ugx(o.price)} per ${place.unit}',
                      style: context.text.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    ),
  );
}
