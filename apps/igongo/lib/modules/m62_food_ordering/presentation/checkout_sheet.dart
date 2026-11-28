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
import '../../../shared/api/api_exception.dart';
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
import '../application/saved_pin_providers.dart';
import '../domain/cart_quote.dart';
import '../domain/delivery_pin.dart';
import 'map/delivery_pin_map.dart';
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

  /// The zone and place the guest confirmed for delivery ("zone|place"); null until confirmed.
  String? _confirmedFor;

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

  /// True when the guest confirmed the zone and place now showing.
  bool get _isConfirmed => _confirmedFor != null && _confirmedFor == '$_zone|${_text(_place)}';

  /// The map point chosen for the delivery, or null.
  DeliveryPin? _pin;

  /// The map point, only while the zone and place still match the pin it was chosen for (else null).
  DeliveryPin? get _confirmedPin {
    final pin = _pin;
    if (pin == null || pin.label != _text(_place) || pin.zone != _zone) return null;
    return pin;
  }

  /// Fills the zone and place from the guest's saved pin, and keeps its map point.
  void _useSavedPin(DeliveryPin pin) {
    setState(() {
      _zone = pin.zone;
      _place.text = pin.label;
      _pin = pin;
    });
  }

  /// The guest tapped the map: the point is taken with the zone and place typed, then saved for next time.
  Future<void> _onPinned(double lat, double lng) async {
    // Step 1: a map point needs a zone and a place, since the rider reads the place.
    final place = _text(_place);
    final zone = _zone;
    if (place == null || zone == null) return showIgongoToast(context, 'Choose the zone and type where to deliver first.');
    final pin = DeliveryPin(label: place, zone: zone, lat: lat, lng: lng);
    // Step 2: use the point for this checkout straight away.
    setState(() => _pin = pin);
    // Step 3: save the point on the server so it is remembered for the guest's next order.
    try {
      await ref.read(savedPinApiProvider).save(pin);
      ref.invalidate(savedPinProvider);
    } on ApiException {
      // Step 4: the order still uses the point; only the "saved" copy failed.
      if (mounted) showIgongoToast(context, 'Could not save your place. This order still uses it.');
    }
  }

  /// The cart and details as the API takes them.
  Json _body(String outlet, String type) {
    final place = _text(_place);
    final notes = _text(_notes);
    return {
      'outlet': outlet,
      'type': type,
      'lines': [for (final l in ref.read(cartProvider).lines) l.toJson()],
      // Dine-in, takeaway, delivery and pre-order all send the guest's time to the API.
      'arriveAt': ?_arriveAt?.toUtc().toIso8601String(),
      // Delivery sends the map point too, when the guest chose one on the map for this place.
      if (type == 'delivery') 'deliverTo': {'label': place ?? '', 'zone': _zone, 'lat': _confirmedPin?.lat, 'lng': _confirmedPin?.lng},
      if (type == 'room_service') 'deliverTo': {'label': 'Room $place', 'zone': null, 'lat': null, 'lng': null},
      if (type == 'dine_in') 'table': place,
      'notes': ?notes,
      'allergies': ?_text(_allergies),
      'promoCode': ?_text(_promo),
    };
  }

  /// Asks the server for the price with the code (and the delivery fee).
  Future<void> _applyCode(String outlet) async {
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
    if (type == 'dine_in' && _arriveAt == null) return showIgongoToast(context, 'Choose what time you are coming.');
    if (type == 'delivery' && (_zone == null || _text(_place) == null)) {
      return showIgongoToast(context, 'Choose the zone and type where to deliver.');
    }
    if ((type == 'room_service' || type == 'dine_in') && _text(_place) == null) {
      return showIgongoToast(context, type == 'dine_in' ? 'Type your table.' : 'Type your room.');
    }
    if (type == 'delivery' && !_isConfirmed) return showIgongoToast(context, 'Confirm the delivery location.');
    // A visitor signs in first; their choices stay on screen.
    if (!signedInOrAsk(context, ref)) return;
    setState(() => _busy = true);
    try {
      // Step 2: place it; the API prices it again and applies the rules and the code.
      final order = await ref.read(ordersApiProvider).place({..._body(outlet, type), 'requestKey': _requestKey});
      ref.read(cartProvider.notifier).clear();
      if (type == 'delivery') ref.read(lastDeliveryProvider.notifier).set(_zone, _text(_place) ?? '');
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
    // The order types this outlet takes come from the server's rules.
    final types = rules?.typesAt(outlet) ?? const <String>[];
    // The takeaway container fee is the super admin's rule (0 = free); the server adds it to the total.
    final containerCharge = _type == 'takeaway' ? (rules?.containerFee ?? 0) : 0;
    final total = cart.lines.fold(0, (sum, l) => sum + l.unitPrice * l.quantity) + containerCharge;
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
            Text(
              'About ${ugx(total)} before delivery${containerCharge > 0 ? ' (container included)' : ''}',
              style: context.text.bodySmall,
            ),
            if (rules == null) const LinearProgressIndicator(),
            if (rules != null && types.isEmpty) const Text('This outlet takes no app orders right now.'),
            Wrap(
              spacing: IgongoSpace.sm,
              children: [
                for (final t in orderTypes.where(types.contains))
                  ChoiceChip(
                    label: Text(orderTypeWords(t)),
                    selected: _type == t,
                    onSelected: (_) => setState(() {
                      _type = t;
                      // Delivery: fill in last time's location (the guest must still confirm it).
                      final last = ref.read(lastDeliveryProvider);
                      if (t == 'delivery' && _zone == null && _place.text.isEmpty) {
                        _zone = last.zone;
                        _place.text = last.place;
                      }
                    }),
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
            // Delivery: the guest's saved pin can be reused, and the map (when set up) picks a point.
            if (_type == 'delivery') ...[
              if (ref.watch(savedPinProvider).valueOrNull case final saved?)
                ActionChip(label: Text('Use my saved place: ${saved.label}'), onPressed: () => _useSavedPin(saved)),
              DeliveryPinMap(pin: _confirmedPin, onPinned: _onPinned),
            ],
            if (_type == 'delivery' || _type == 'room_service' || _type == 'dine_in')
              IgongoField(
                label: switch (_type) {
                  'delivery' => 'Where to deliver',
                  'dine_in' => 'Table',
                  _ => 'Room number',
                },
                controller: _place,
                // Redraw as the guest types, so the delivery confirmation always shows the current place.
                onChanged: (_) => setState(() {}),
              ),
            if (_type == 'pre_order' || _type == 'delivery' || _type == 'takeaway' || _type == 'dine_in')
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.schedule),
                title: Text(
                  _arriveAt == null
                      ? (_type == 'pre_order' || _type == 'dine_in'
                            ? 'What time are you coming?'
                            : 'As soon as possible (tap to set a time)')
                      : TimeOfDay.fromDateTime(_arriveAt!).format(context),
                ),
                onTap: () => _pickTime(_type == 'dine_in' ? 15 : (rules?.preorderMinNoticeMinutes ?? 60)),
              ),
            // Takeaway: containers are free unless the super admin set a price, which is shown here.
            if (containerCharge > 0) Text('Container +${ugx(containerCharge)}'),
            // Delivery: the guest confirms the location before ordering.
            if (_type == 'delivery')
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(
                  _zone == null || _text(_place) == null
                      ? 'Choose a zone and type where to deliver'
                      : 'Confirm delivery to ${zones.where((z) => z.zone == _zone).firstOrNull?.name ?? ''}: ${_text(_place)}',
                ),
                value: _isConfirmed,
                onChanged: _zone == null || _text(_place) == null
                    ? null
                    : (v) => setState(() => _confirmedFor = (v ?? false) ? '$_zone|${_text(_place)}' : null),
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
                  if (q.containerFee > 0) 'Container ${ugx(q.containerFee)}',
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
