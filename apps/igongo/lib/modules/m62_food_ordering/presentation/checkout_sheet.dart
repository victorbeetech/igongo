// Checkout: how the guest wants the food (only the types the super admin
// switched on for this outlet), when (pre-orders and timed deliveries:
// "1 kg fried beef, I'm coming at 4 PM"), where (delivery zone and place,
// room or table), notes, allergies and a promo or voucher code ("Apply"
// asks the server for the price; the app never works out a discount).
// Placing it sends one checkout key, so a double tap never orders twice,
// then opens the pay sheet when the rules ask for money first.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_client.dart';
import '../../../shared/format/request_key.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/payments/presentation/pay_sheet.dart';
import '../../../shared/session/sign_in_first.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../demo/demo_menu.dart';
import '../demo/demo_orders.dart';
import '../domain/cart_quote.dart';
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
  final _promo = TextEditingController();

  /// This checkout's key: the same order comes back if "Place order" is tapped twice.
  final _requestKey = newRequestKey();
  CartQuote? _quote;
  String? _type;
  String? _zone;
  DateTime? _arriveAt;
  bool _busy = false;

  @override
  void dispose() {
    _place.dispose();
    _notes.dispose();
    _allergies.dispose();
    _promo.dispose();
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

  /// The cart and details as the API takes them.
  Json _body(String outlet, String type) {
    final place = _text(_place);
    return {
      'outlet': outlet,
      'type': type,
      'lines': [for (final l in ref.read(cartProvider).lines) l.toJson()],
      'arriveAt': ?_arriveAt?.toUtc().toIso8601String(),
      if (type == 'delivery') 'deliverTo': {'label': place ?? '', 'zone': _zone, 'lat': null, 'lng': null},
      if (type == 'room_service') 'deliverTo': {'label': 'Room $place', 'zone': null, 'lat': null, 'lng': null},
      if (type == 'dine_in') 'table': place,
      'notes': ?_text(_notes),
      'allergies': ?_text(_allergies),
      'promoCode': ?_text(_promo),
    };
  }

  /// Asks the server for the price with the code (and the delivery fee).
  Future<void> _applyCode(String outlet) async {
    if (isDemoOutlet(outlet)) return showIgongoToast(context, 'Codes are not used in the demo menu.');
    final type = _type;
    if (type == null) return showIgongoToast(context, 'Choose how you want it first.');
    if (type == 'delivery' && _zone == null) return showIgongoToast(context, 'Choose the zone first.');
    try {
      final quote = await ref.read(ordersApiProvider).quote(_body(outlet, type));
      if (mounted) setState(() => _quote = quote);
    } on Exception catch (e) {
      if (mounted) {
        setState(() => _quote = null);
        showIgongoToast(context, '$e');
      }
    }
  }

  /// Places the order, then pays when money is due now.
  Future<void> _placeOrder(String outlet) async {
    final type = _type;
    final cart = ref.read(cartProvider);
    if (cart.lines.isEmpty) return;
    // Step 1: check the form has what this order type needs.
    if (type == null) return showIgongoToast(context, 'Choose how you want it.');
    if (type == 'pre_order' && _arriveAt == null) return showIgongoToast(context, 'Choose when you are coming.');
    if (type == 'delivery' && (_zone == null || _text(_place) == null)) {
      return showIgongoToast(context, 'Choose the zone and type where to deliver.');
    }
    if ((type == 'room_service' || type == 'dine_in') && _text(_place) == null) {
      return showIgongoToast(context, type == 'dine_in' ? 'Type your table.' : 'Type your room.');
    }
    // Demo menu: a local demo order only; nothing is sent or charged (demo/demo_orders.dart).
    if (isDemoOutlet(outlet)) {
      final order = ref.read(demoOrdersProvider.notifier).place(cart.lines, type);
      ref.read(cartProvider.notifier).clear();
      ref.invalidate(myOrdersProvider);
      Navigator.of(context).pop();
      return showIgongoToast(context, 'Demo order ${order.number} placed. Nothing was sent or charged.');
    }
    // A visitor signs in first; their choices stay on screen.
    if (!signedInOrAsk(context, ref)) return;
    setState(() => _busy = true);
    try {
      // Step 2: place it; the API prices it again and applies the rules and the code.
      final order = await ref.read(ordersApiProvider).place({..._body(outlet, type), 'requestKey': _requestKey});
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
    final demo = isDemoOutlet(outlet);
    // The demo outlet has its own order types; real outlets follow the server's rules.
    final types = demo ? demoOrderTypes : (rules?.typesAt(outlet) ?? const <String>[]);
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
            if (rules == null && !demo) const LinearProgressIndicator(),
            if (!demo && rules != null && types.isEmpty) const Text('This outlet takes no app orders right now.'),
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
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              spacing: IgongoSpace.sm,
              children: [
                Expanded(
                  child: IgongoField(label: 'Promo or voucher code', controller: _promo),
                ),
                IgongoButton(label: 'Apply', variant: ButtonVariant.secondary, onPressed: () => _applyCode(outlet)),
              ],
            ),
            if (_quote case final q?)
              Text(
                [
                  if (q.discount > 0) '${q.promoLabel ?? 'Code'}: −${ugx(q.discount)}',
                  if (q.deliveryFee > 0) 'Delivery ${ugx(q.deliveryFee)}',
                  'Total ${ugx(q.total)}',
                ].join(' · '),
                style: context.text.titleMedium,
              ),
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
