// The Filter & Refine screen: narrows the dish results by outlet, by dishes on
// sale today and by the highest price, and orders them. Choices are held as a
// draft here and only written to the app's filter (searchFiltersProvider) when
// the guest taps Apply, so Cancel or closing leaves the results as they were.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../hotel/application/public_settings_providers.dart';
import '../../../modules/m00_app_shell/domain/menu_search_results.dart';
import '../../../modules/m00_app_shell/domain/search_item_hit.dart';
import '../../search/application/search_filters_provider.dart';
import '../../search/domain/apply_search_filters.dart';
import '../../search/domain/search_filters.dart';
import '../../search/domain/search_sort.dart';
import '../../theme/theme.dart';
import '../domain/refine_option.dart';
import '../domain/refine_price_range.dart';
import 'widgets/refine_amenity_row.dart';
import 'widgets/refine_category_pill.dart';
import 'widgets/refine_footer.dart';
import 'widgets/refine_header.dart';
import 'widgets/refine_hero.dart';
import 'widgets/refine_price_card.dart';
import 'widgets/refine_section_card.dart';
import 'widgets/refine_sort_grid.dart';

/// The Filter & Refine screen for the dish results in [results].
class FilterRefineScreen extends ConsumerStatefulWidget {
  /// Creates the screen. [results] are the results on the search screen (may be empty).
  const FilterRefineScreen({super.key, required this.results});

  /// The results the choices narrow: their outlets and price range come from here.
  final MenuSearchResults results;

  @override
  ConsumerState<FilterRefineScreen> createState() => _FilterRefineScreenState();
}

class _FilterRefineScreenState extends ConsumerState<FilterRefineScreen> {
  /// The choices as the guest is setting them (written to the app only on Apply).
  late SearchFilters _draft = ref.read(searchFiltersProvider);

  /// The lowest and highest dish price on the results, in whole shillings (0 when there are no dishes).
  late final int _minPrice = widget.results.items.isEmpty
      ? 0
      : widget.results.items.map((SearchItemHit i) => i.price).reduce((a, b) => a < b ? a : b);
  late final int _maxPrice = widget.results.items.isEmpty
      ? 0
      : widget.results.items.map((SearchItemHit i) => i.price).reduce((a, b) => a > b ? a : b);

  /// The price slider positions, from 0 to 1 across the lowest and highest dish price.
  RangeValues get _sliderValues {
    final cap = _draft.maxPrice;
    final span = _maxPrice - _minPrice;
    final high = cap == null || span <= 0 ? 1.0 : ((cap - _minPrice) / span).clamp(0.0, 1.0);
    return RangeValues(0, high);
  }

  /// Puts every choice back to the default.
  void _reset() => setState(() => _draft = const SearchFilters());

  /// Flips one outlet in or out of the draft choice.
  void _toggleOutlet(String key) {
    final next = {..._draft.outlets};
    setState(() {
      next.contains(key) ? next.remove(key) : next.add(key);
      _draft = _draft.copyWith(outlets: next);
    });
  }

  /// Sets the highest price from the slider; at the far right means no limit.
  void _setPrice(RangeValues values) {
    final span = _maxPrice - _minPrice;
    setState(() {
      _draft = values.end >= 1 || span <= 0
          ? _draft.copyWith(clearMaxPrice: true)
          : _draft.copyWith(maxPrice: _minPrice + (values.end * span).round());
    });
  }

  /// Writes the draft to the app's filter and closes the screen.
  void _apply() {
    ref.read(searchFiltersProvider.notifier).apply(_draft);
    Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final outlets = widget.results.outlets;
    // Step 1: the hotel's name for the header line, from the admin's hotel profile.
    final hotelName = ref.watch(publicSettingsProvider).valueOrNull?.hotel.name ?? '';
    // Step 2: how many dishes the draft would show, for the Apply button.
    final shown = applySearchFilters(widget.results, _draft).items.length;
    return Scaffold(
      backgroundColor: palette.background,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 24,
            children: [
              RefineHeader(onReset: _reset, onClose: () => Navigator.of(context).maybePop()),
              RefineHero(place: hotelName, title: 'Curate Your Igongo Stay'),
              // Step 3: the outlets on the results, one pill each. Empty until a search has results.
              RefineSectionCard(
                title: 'Outlets',
                trailing: Text('Multi-select', style: context.text.labelSmall!.copyWith(color: palette.textMuted)),
                note: outlets.isEmpty ? 'Search for a dish to see the outlets that sell it' : null,
                child: Wrap(
                  spacing: 8,
                  children: [
                    for (final outlet in outlets)
                      RefineCategoryPill(
                        option: RefineOption(label: outlet.name),
                        selected: _draft.outlets.contains(outlet.key),
                        onTap: () => _toggleOutlet(outlet.key),
                      ),
                  ],
                ),
              ),
              // Step 4: the price range of the dishes on the results.
              RefinePriceCard(
                price: RefinePriceRange(
                  minLabel: widget.results.items.isEmpty ? '—' : ugx(_minPrice),
                  maxLabel: widget.results.items.isEmpty ? '—' : ugx(_maxPrice),
                  low: 0,
                  high: _sliderValues.end,
                ),
                values: _sliderValues,
                onChanged: _setPrice,
              ),
              // Step 5: the order of the results.
              RefineSectionCard(
                title: 'Sort By',
                child: RefineSortGrid(
                  options: [
                    for (final sort in SearchSort.values) RefineOption(label: sort.label, selected: sort == _draft.sort),
                  ],
                  selected: _draft.sort.index,
                  onPick: (index) => setState(() => _draft = _draft.copyWith(sort: SearchSort.values[index])),
                ),
              ),
              // Step 6: availability, the one amenity the results carry.
              RefineSectionCard(
                title: 'Availability',
                gap: 10,
                child: RefineAmenityRow(
                  option: const RefineOption(label: 'On sale today only', icon: Icons.today_outlined),
                  on: _draft.availableOnly,
                  onTap: () => setState(() => _draft = _draft.copyWith(availableOnly: !_draft.availableOnly)),
                ),
              ),
            ],
          ),
        ),
      ),
      // Step 7: the pinned bar with the count and the Apply button.
      bottomNavigationBar: SafeArea(
        top: false,
        child: RefineFooter(resultCount: shown, onClear: _reset, onApply: _apply),
      ),
    );
  }
}
