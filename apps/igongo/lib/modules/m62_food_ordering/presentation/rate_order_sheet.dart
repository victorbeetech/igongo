// Rate a delivered order (S62-11): stars for the food, stars for the
// delivery when a rider brought it, and a short review. Sent once; the
// server refuses a second rating, someone else's order, or an order that
// has not reached the guest yet.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/orders_providers.dart';
import '../domain/order.dart';

/// Opens the rating sheet for [order].
Future<void> showRateOrderSheet(BuildContext context, Order order) => showModalBottomSheet<void>(
  context: context,
  isScrollControlled: true,
  builder: (_) => RateOrderSheet(order: order),
);

/// The sheet's body.
class RateOrderSheet extends ConsumerStatefulWidget {
  /// Creates the sheet for [order].
  const RateOrderSheet({super.key, required this.order});

  /// The delivered order being rated.
  final Order order;

  @override
  ConsumerState<RateOrderSheet> createState() => _RateOrderSheetState();
}

class _RateOrderSheetState extends ConsumerState<RateOrderSheet> {
  final _comment = TextEditingController();
  int _food = 0;
  int _delivery = 0;
  bool _busy = false;

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  /// Sends the rating, then refreshes "my orders".
  Future<void> _send() async {
    setState(() => _busy = true);
    try {
      final comment = _comment.text.trim();
      await ref
          .read(ordersApiProvider)
          .rate(
            widget.order.id,
            food: _food,
            delivery: widget.order.type == 'delivery' && _delivery > 0 ? _delivery : null,
            comment: comment.isEmpty ? null : comment,
          );
      ref
        ..invalidate(myOrdersProvider)
        ..invalidate(starsProvider);
      if (!mounted) return;
      Navigator.of(context).pop();
      showIgongoToast(context, 'Thank you for rating ${widget.order.number}');
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.fromLTRB(
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg,
      IgongoSpace.lg + MediaQuery.viewInsetsOf(context).bottom,
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.md,
      children: [
        Text('Rate ${widget.order.number}', style: context.text.titleLarge),
        _StarsRow(label: 'Food', value: _food, onChanged: (v) => setState(() => _food = v)),
        if (widget.order.type == 'delivery')
          _StarsRow(label: 'Delivery', value: _delivery, onChanged: (v) => setState(() => _delivery = v)),
        IgongoField(label: 'Your review (optional)', controller: _comment, lines: 3),
        IgongoButton(
          label: _busy ? 'Sending…' : 'Send rating',
          expand: true,
          onPressed: _busy || _food == 0 ? null : _send,
        ),
      ],
    ),
  );
}

/// Five tappable stars with a label, read out as "Food, 4 of 5 stars".
class _StarsRow extends StatelessWidget {
  const _StarsRow({required this.label, required this.value, required this.onChanged});

  final String label;
  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) => Semantics(
    label: '$label, $value of 5 stars',
    child: Row(
      children: [
        SizedBox(
          width: IgongoSpace.xxl * 2,
          child: Text(label, style: context.text.titleSmall),
        ),
        for (var i = 1; i <= 5; i++)
          IconButton(
            tooltip: '$i of 5',
            icon: Icon(i <= value ? Icons.star : Icons.star_border, color: context.palette.primary),
            onPressed: () => onChanged(i),
          ),
      ],
    ),
  );
}
