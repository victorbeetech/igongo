// The room (or ticket, table, event, spa) list of a booking module: a date bar
// at the top (tap to change the days), a filter button in the app bar, then the
// offerings live from the API. Tapping one opens its booking details. Signed
// out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../format/day_label.dart';
import '../../live/live_view.dart';
import '../../layout/igongo_scaffold.dart';
import '../../screens/parts/purpose_text.dart';
import '../../screens/parts/screen_list_view.dart';
import '../../screens/screen_layout.dart';
import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';
import '../application/bookings_providers.dart';
import '../domain/booking_place.dart';
import '../domain/booking_selection.dart';
import '../domain/offering.dart';
import '../domain/offering_filter.dart';
import 'booking_details_screen.dart';
import 'date_select_screen.dart';
import 'filter_sheet.dart';
import 'offering_card.dart';

/// What [place] sells, to book, with dates and filters.
class BookScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen] at [place].
  const BookScreen(this.screen, this.place, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// The booking module.
  final BookingPlace place;

  @override
  ConsumerState<BookScreen> createState() => _BookScreenState();
}

class _BookScreenState extends ConsumerState<BookScreen> {
  /// The days picked, or null until the guest picks some.
  BookingSelection? _dates;

  /// The price and type filter in force.
  OfferingFilter _filter = const OfferingFilter();

  /// True when an offering needs days picked (fixed-date events and shop items do not).
  bool _needsDays(Offering o) => o.onDate == null && o.kind != 'stock';

  /// Opens the date screen; stores the days picked (and returns them). [nights] asks for check-out too.
  Future<BookingSelection?> _pickDates({required bool nights}) async {
    final picked = await Navigator.of(context).push<BookingSelection>(
      MaterialPageRoute<BookingSelection>(
        builder: (_) => DateSelectScreen(nights: nights, initial: _dates),
      ),
    );
    if (picked != null && mounted) setState(() => _dates = picked);
    return picked;
  }

  /// Opens the filter sheet and applies what the guest chooses.
  Future<void> _filters(List<Offering> all) async {
    final chosen = await showFilterSheet(context, offerings: all, current: _filter);
    if (chosen != null && mounted) setState(() => _filter = chosen);
  }

  /// Opens an offering: picks the days first when it needs them, then the details.
  Future<void> _open(Offering o) async {
    var dates = _dates;
    // Step 1: days first, for a stay that has no check-out day yet, or when no day is picked.
    final needsCheckOut = o.kind == 'nights' && dates?.to == null;
    if (_needsDays(o) && (dates == null || needsCheckOut)) {
      dates = await _pickDates(nights: o.kind == 'nights');
      if (dates == null) return;
    }
    if (!mounted) return;
    // Step 2: the details of this one offering.
    await Navigator.of(context).push<void>(
      MaterialPageRoute<void>(
        builder: (_) => BookingDetailsScreen(place: widget.place, offering: o, dates: dates),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final place = widget.place;
    return LiveView<List<Offering>>(
      screenName: widget.screen.spec.name,
      value: ref.watch(offeringsProvider(place)),
      onRetry: () => ref.invalidate(offeringsProvider(place)),
      sample: (_) => screenLayout(widget.screen),
      builder: (context, all, _) {
        final shown = _filter.apply(all);
        final stays = all.any((o) => o.kind == 'nights');
        return IgongoScaffold(
          title: 'Available ${place.unit}s',
          actions: [
            IconButton(
              tooltip: 'Filters',
              icon: const Icon(Icons.tune),
              onPressed: () => _filters(all),
            ),
          ],
          body: RefreshIndicator(
            onRefresh: () => ref.refresh(offeringsProvider(place).future),
            child: ScreenListView(
              children: [
                PurposeText(widget.screen.spec.purpose),
                // Step 1: the date bar; tapping it changes the days.
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                  child: IgongoCard(
                    onTap: () => _pickDates(nights: stays),
                    child: Row(
                      children: [
                        Icon(Icons.calendar_month_outlined, color: context.palette.primaryText),
                        const SizedBox(width: IgongoSpace.md),
                        Expanded(child: Text(_dateWords(stays), style: context.text.titleSmall)),
                        Icon(Icons.expand_more, color: context.palette.textMuted),
                      ],
                    ),
                  ),
                ),
                // Step 2: the offerings that pass the filter.
                if (shown.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(IgongoSpace.lg),
                    child: Text(all.isEmpty ? 'Nothing to book yet.' : 'No ${place.unit}s match these filters.'),
                  ),
                for (final o in shown)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                    child: OfferingCard(offering: o, unit: place.unit, onTap: () => _open(o)),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// The date bar's words: the picked days, or a prompt.
  String _dateWords(bool stays) {
    final d = _dates;
    if (d == null) return stays ? 'Pick check-in and check-out' : 'Pick a day';
    final to = d.to;
    if (stays && to != null) return '${shortDay(d.from)}  →  ${shortDay(to)}  ·  ${d.nights} nights';
    return shortDay(d.from);
  }
}
