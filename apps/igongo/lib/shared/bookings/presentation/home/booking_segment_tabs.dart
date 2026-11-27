// The row of pill tabs under the active reservation: Active Stays, E-Receipts,
// Past Visits and Heritage Club. The chosen pill fills red; each one opens its
// screen. Heritage Club has no screen yet (placeholder), so it only selects.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// One pill: its words, icon, and the screen it opens (null for placeholder).
class _Pill {
  const _Pill(this.label, this.icon, this.screenId);

  /// The words on the pill (with any count already in them).
  final String label;

  /// The pill's icon.
  final IconData icon;

  /// The screen number it opens, or null.
  final String? screenId;
}

/// The segmented pill tabs for the Bookings tab.
class BookingSegmentTabs extends StatefulWidget {
  /// Creates the tabs. [activeCount] and [receiptCount] fill the counts in the labels.
  const BookingSegmentTabs({
    super.key,
    required this.activeCount,
    required this.receiptCount,
    required this.open,
  });

  /// How many active stays there are (shown in the first label).
  final int activeCount;

  /// How many receipts there are (shown in the second label).
  final int receiptCount;

  /// Opens a screen by its number.
  final void Function(String screenId) open;

  @override
  State<BookingSegmentTabs> createState() => _BookingSegmentTabsState();
}

class _BookingSegmentTabsState extends State<BookingSegmentTabs> {
  /// The index of the pill that is filled red.
  int _selected = 0;

  @override
  Widget build(BuildContext context) {
    final pills = [
      _Pill('Active Stays (${widget.activeCount})', Icons.check_circle_outline, 'S67-06'),
      _Pill('E-Receipts (${widget.receiptCount})', Icons.receipt_long_outlined, 'S78-06'),
      _Pill('Past Visits', Icons.history, 'S67-06'),
      const _Pill('Heritage Club', Icons.loyalty_outlined, null),
    ];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xxs),
      child: Row(
        spacing: IgongoSpace.sm,
        children: [
          for (var i = 0; i < pills.length; i++) _pill(context, pills[i], i),
        ],
      ),
    );
  }

  /// One pill, filled when it is the selected one.
  Widget _pill(BuildContext context, _Pill pill, int index) {
    final p = context.palette;
    final on = index == _selected;
    return ChoiceChip(
      avatar: Icon(pill.icon, size: 18, color: on ? p.onPrimary : p.textMuted),
      label: Text(pill.label),
      selected: on,
      showCheckmark: false,
      selectedColor: p.primary,
      backgroundColor: p.surface,
      side: BorderSide(color: on ? p.primary : p.border),
      labelStyle: context.text.labelMedium?.copyWith(color: on ? p.onPrimary : p.text),
      shape: const StadiumBorder(),
      onSelected: (_) {
        // Select the pill, then open its screen when it has one.
        setState(() => _selected = index);
        final id = pill.screenId;
        if (id != null) widget.open(id);
      },
    );
  }
}
