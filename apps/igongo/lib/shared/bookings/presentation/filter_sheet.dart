// The filter sheet for the room list: a price range (slider) and room types
// (checkboxes). Apply returns the new filter; Clear returns an empty one; a
// dismissed sheet returns nothing, so the list keeps its old filter.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/ugx.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../domain/offering.dart';
import '../domain/offering_filter.dart';
import '../domain/room_types.dart';

/// Opens the filter sheet for [offerings], starting from [current]; null if dismissed.
Future<OfferingFilter?> showFilterSheet(
  BuildContext context, {
  required List<Offering> offerings,
  required OfferingFilter current,
}) => showModalBottomSheet<OfferingFilter>(
  context: context,
  isScrollControlled: true,
  builder: (_) => FilterSheet(offerings: offerings, current: current),
);

/// The filter form.
class FilterSheet extends StatefulWidget {
  /// Creates the form for [offerings], starting from [current].
  const FilterSheet({super.key, required this.offerings, required this.current});

  /// The offerings the price slider covers.
  final List<Offering> offerings;

  /// The filter in force when the sheet opened.
  final OfferingFilter current;

  @override
  State<FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<FilterSheet> {
  /// The highest price on the slider (the top of the range).
  late final double _ceiling;

  /// The chosen low and high ends of the price range.
  late RangeValues _range;

  /// The room types ticked.
  late Set<String> _types;

  @override
  void initState() {
    super.initState();
    // Step 1: the slider runs from 0 to the dearest offering (at least 1, so the slider is valid).
    var top = 0;
    for (final o in widget.offerings) {
      if (o.price > top) top = o.price;
    }
    _ceiling = top < 1 ? 1 : top.toDouble();
    // Step 2: start from the filter in force; no upper limit means the top of the slider.
    final low = widget.current.minPrice.toDouble().clamp(0, _ceiling).toDouble();
    final high = (widget.current.maxPrice ?? top).toDouble().clamp(low, _ceiling).toDouble();
    _range = RangeValues(low, high);
    _types = {...widget.current.types};
  }

  /// Builds the filter from the form. A high end at the top of the slider means no limit.
  OfferingFilter get _filter => OfferingFilter(
    minPrice: _range.start.round(),
    maxPrice: _range.end >= _ceiling ? null : _range.end.round(),
    types: _types,
  );

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.fromLTRB(
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg + MediaQuery.viewInsetsOf(context).bottom,
    ),
    child: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          Text('Filters', style: context.text.titleLarge),
          // Step 1: the price range, with the two ends written out.
          Text('Price range', style: context.text.titleSmall),
          RangeSlider(values: _range, min: 0, max: _ceiling, onChanged: (v) => setState(() => _range = v)),
          Row(
            children: [
              Expanded(child: Text(ugx(_range.start.round()), style: context.text.bodySmall)),
              Text(
                _range.end >= _ceiling ? '${ugx(_range.end.round())}+' : ugx(_range.end.round()),
                style: context.text.bodySmall,
              ),
            ],
          ),
          // Step 2: the room types, one tick each.
          Text('Room type', style: context.text.titleSmall),
          for (final word in roomTypeWords)
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(word),
              value: _types.contains(word),
              onChanged: (on) => setState(() => on == true ? _types.add(word) : _types.remove(word)),
            ),
          // Step 3: apply, or clear everything.
          IgongoButton(label: 'Apply filters', expand: true, onPressed: () => Navigator.of(context).pop(_filter)),
          IgongoButton(
            label: 'Clear filters',
            variant: ButtonVariant.text,
            expand: true,
            onPressed: () => Navigator.of(context).pop(const OfferingFilter()),
          ),
        ],
      ),
    ),
  );
}
