// Checkout: how the guest wants the food (only the types the super admin
// switched on for this outlet), when (pre-orders and timed deliveries:
// "1 kg fried beef, I'm coming at 4 PM"), where (delivery zone and place,
// room or table), notes and allergies. Placing it opens the pay sheet when
// the rules ask for money first.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/payments/presentation/pay_sheet.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../domain/order_type.dart';

/// The checkout sheet for the cart.
class CheckoutSheet extends ConsumerStatefulWidget {
  /// Creates the sheet.
  const CheckoutSheet({super.key});

  @override
  ConsumerState<CheckoutSheet> createState() => _CheckoutSheetState();
}

class _CheckoutSheetState extends ConsumerState<CheckoutSheet> {
  final _place = TextEditingController();
  final _notes = TextEditingController();
  final _allergies = TextEditingController();
  String? _type;
  String? _zone;
  DateTime? _arriveAt;
  bool _busy = false;

  @override
  void dispose() {
    _place.dispose();
    _notes.dispose();
    _allergies.dispose();
    super.dispose();
  }

  /// Asks for a time today or tomorrow, at least [notice] minutes from now.
  Future<void> _pickTime(int notice) async {
    final earliest = DateTime.now().add(Duration(minutes: notice));
    final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(earliest));
    if (time == null) return;
    var at = DateTime(earliest.year, earliest.month, earliest.day, time.hour, time.minute);
    // A time already past today means tomorrow.
    if (at.isBefore(earliest)) at = at.add(const Duration(days: 1));
    setState(() => _arriveAt = at);
  }

  /// Text of [c], or null when empty.
  static String? _text(TextEditingController c) => c.text.trim().isEmpty ? null : c.text.trim();

  /// Places the order, then pays when money is due now.
  Future<void> _placeOrder(String outlet) async {
    final type = _type;
    final cart = ref.read(cartProvider);
    // Step 1: check the form has what this order type needs.
    if (type == null) return showIgongoToast(context, 'Choose how you want it.');
    if (type == 'pre_order' && _arriveAt == null) return showIgongoToast(context, 'Choose when you are coming.');
    if (type == 'delivery' && (_zone == null || _text(_place) == null)) {
      return showIgongoToast(context, 'Choose the zone and type where to deliver.');
    }
    if ((type == 'room_service' || type == 'dine_in') && _text(_place) == null) {
      return showIgongoToast(context, type == 'dine_in' ? 'Type your table.' : 'Type your room.');
    }
    setState(() => _busy = true);
    try {
      // Step 2: place it; the API prices it again and applies the rules.
      final place = _text(_place);
      final order = await ref.read(ordersApiProvider).place({
        'outlet': outlet,
        'type': type,
        'lines': [for (final l in cart.lines) l.toJson()],
        'arriveAt': ?_arriveAt?.toUtc().toIso8601String(),
        if (type == 'delivery') 'deliverTo': {'label': place, 'zone': _zone, 'lat': null, 'lng': null},
        if (type == 'room_service') 'deliverTo': {'label': 'Room $place', 'zone': null, 'lat': null, 'lng': null},
        if (type == 'dine_in') 'table': place,
        'notes': ?_text(_notes),
        'allergies': ?_text(_allergies),
      });
      ref.read(cartProvider.notifier).clear();
      ref.invalidate(myOrdersProvider);
      if (!mounted) return;
      Navigator.of(context).pop();
      // Step 3: pay now when the order waits for payment.
      if (order.status == 'awaiting_payment' && order.owed > 0) {
        await showPaySheet(
          context,
          module: 'food-ordering',
          recordId: order.id,
          label: 'Order ${order.number}',
          owed: order.owed,
          outlet: outlet,
        );
        ref.invalidate(myOrdersProvider);
      } else {
        showIgongoToast(context, 'Order ${order.number} placed');
      }
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);
    final outlet = cart.outlet ?? '';
    final rules = ref.watch(orderingRulesProvider).valueOrNull;
    final zones = ref.watch(zonesProvider).valueOrNull ?? const [];
    final types = rules?.typesAt(outlet) ?? const <String>[];
    final total = cart.lines.fold(0, (sum, l) => sum + l.unitPrice * l.quantity);
    return Padding(
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
            Text('Your order', style: context.text.titleLarge),
            for (final (i, l) in cart.lines.indexed)
              Row(
                children: [
                  Expanded(child: Text('${l.quantity} × ${l.name}')),
                  Text(ugx(l.unitPrice * l.quantity)),
                  IconButton(
                    tooltip: 'Remove',
                    icon: const Icon(Icons.close),
                    onPressed: () => ref.read(cartProvider.notifier).removeAt(i),
                  ),
                ],
              ),
            Text('About ${ugx(total)} before delivery', style: context.text.bodySmall),
            if (rules == null) const LinearProgressIndicator(),
            if (rules != null && types.isEmpty) const Text('This outlet takes no app orders right now.'),
            Wrap(
              spacing: IgongoSpace.sm,
              children: [
                for (final t in orderTypes.where(types.contains))
                  ChoiceChip(
                    label: Text(orderTypeWords(t)),
                    selected: _type == t,
                    onSelected: (_) => setState(() => _type = t),
                  ),
              ],
            ),
            if (_type == 'delivery')
              Wrap(
                spacing: IgongoSpace.sm,
                children: [
                  for (final z in zones)
                    ChoiceChip(
                      label: Text('${z.name} +${ugx(z.fee)}'),
                      selected: _zone == z.zone,
                      onSelected: (_) => setState(() => _zone = z.zone),
                    ),
                ],
              ),
            if (_type == 'delivery' || _type == 'room_service' || _type == 'dine_in')
              IgongoField(
                label: switch (_type) {
                  'delivery' => 'Where to deliver',
                  'dine_in' => 'Table',
                  _ => 'Room number',
                },
                controller: _place,
              ),
            if (_type == 'pre_order' || _type == 'delivery' || _type == 'takeaway')
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.schedule),
                title: Text(
                  _arriveAt == null
                      ? (_type == 'pre_order' ? 'When are you coming?' : 'As soon as possible (tap to set a time)')
                      : TimeOfDay.fromDateTime(_arriveAt!).format(context),
                ),
                onTap: () => _pickTime(rules?.preorderMinNoticeMinutes ?? 60),
              ),
            IgongoField(label: 'Notes for the kitchen', controller: _notes),
            IgongoField(label: 'Allergies', controller: _allergies),
            IgongoButton(
              label: _busy ? 'Placing…' : 'Place order',
              expand: true,
              onPressed: _busy || cart.lines.isEmpty || types.isEmpty ? null : () => _placeOrder(outlet),
            ),
          ],
        ),
      ),
    );
  }
}
