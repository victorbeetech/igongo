// Past visits: every stay, ticket, table and pass that is over or cancelled,
// newest first, from the live bookings of each visit place. Tapping one opens
// its status and receipt. Signed out, the screen asks for a sign-in.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/bookings/presentation/booking_status_screen.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/layout/igongo_scaffold.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/chip/status_chip.dart';
import '../application/past_visits_providers.dart';
import '../domain/past_visit.dart';

/// The screen's name, used in its title and messages.
const _title = 'Past visits';

/// The list of past visits, live from the API.
class PastVisitsScreen extends ConsumerWidget {
  /// Creates the screen.
  const PastVisitsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => IgongoScaffold(
    title: _title,
    body: RefreshIndicator(
      onRefresh: () => ref.refresh(pastVisitsProvider.future),
      child: LiveView<List<PastVisit>>(
        screenName: _title,
        value: ref.watch(pastVisitsProvider),
        onRetry: () => ref.invalidate(pastVisitsProvider),
        // The design preview has no guest history to show, so it shows the empty state.
        sample: (_) => const _VisitList(visits: []),
        builder: (context, visits, _) => _VisitList(visits: visits),
      ),
    ),
  );
}

/// The visits as cards, or a line when there are none.
class _VisitList extends StatelessWidget {
  /// Creates the list.
  const _VisitList({required this.visits});

  /// The visits, newest first.
  final List<PastVisit> visits;

  @override
  Widget build(BuildContext context) {
    // Step 1: no visits yet, so say so in one line.
    if (visits.isEmpty) {
      return ScreenListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Text('No past visits yet.', style: context.text.bodyMedium),
          ),
        ],
      );
    }
    // Step 2: one card per visit; tapping opens its status and receipt.
    return ScreenListView(
      children: [
        for (final v in visits)
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
            child: _VisitCard(visit: v),
          ),
      ],
    );
  }
}

/// One past visit: what it was, when, its status and what was paid.
class _VisitCard extends StatelessWidget {
  /// Creates the card.
  const _VisitCard({required this.visit});

  /// The visit shown.
  final PastVisit visit;

  @override
  Widget build(BuildContext context) {
    final b = visit.booking;
    return IgongoCard(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute<void>(builder: (_) => BookingStatusScreen(booking: b, place: visit.place)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.xs,
        children: [
          Row(
            children: [
              Expanded(child: Text(b.offeringName, style: context.text.titleMedium)),
              StatusChip(statusWords(b.status)),
            ],
          ),
          Text('${b.units} × ${visit.place.unit}  ·  ${b.when}', style: context.text.bodySmall),
          Text('${ugx(b.paid)} paid of ${ugx(b.total)}', style: context.text.bodySmall),
        ],
      ),
    );
  }
}
