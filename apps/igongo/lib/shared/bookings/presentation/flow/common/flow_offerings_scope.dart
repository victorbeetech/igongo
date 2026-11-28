// Loads one booking module's offerings and rules for a designed flow screen,
// and handles the loading, error and empty states once for all of them.
// The screen builds its body from the loaded offerings (`all`) and the rules.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../application/bookings_providers.dart';
import '../../../domain/booking_place.dart';
import '../../../domain/booking_rules.dart';
import '../../../domain/offering.dart';

/// Builds a flow body from the module's offerings once they load.
typedef FlowBodyBuilder = Widget Function(BuildContext context, List<Offering> all, BookingRules? rules);

/// Watches the offerings (and the rules) of [place], and shows the loading,
/// error or empty state, or [builder] once there is something to book.
class FlowOfferingsScope extends ConsumerWidget {
  /// Creates the scope for [place].
  const FlowOfferingsScope({super.key, required this.place, required this.builder, this.emptyText = 'Nothing to book yet.'});

  /// The booking module.
  final BookingPlace place;

  /// Builds the body once the offerings are loaded.
  final FlowBodyBuilder builder;

  /// The words shown when nothing is on sale.
  final String emptyText;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final offerings = ref.watch(offeringsProvider(place));
    final rules = ref.watch(bookingRulesProvider(place)).valueOrNull;
    return offerings.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Could not load. $e', textAlign: TextAlign.center),
              const SizedBox(height: IgongoSpace.md),
              FilledButton(onPressed: () => ref.invalidate(offeringsProvider(place)), child: const Text('Try again')),
            ],
          ),
        ),
      ),
      data: (all) => all.isEmpty
          ? Center(child: Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text(emptyText)))
          : builder(context, all, rules),
    );
  }
}
