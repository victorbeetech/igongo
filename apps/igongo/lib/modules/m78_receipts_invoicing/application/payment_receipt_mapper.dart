// Turns one API payment (and, for a booking, its booking record) into a
// GuestReceipt for the My receipts list and the Receipt Detail ticket. Only
// real fields are filled in. Fields no API holds (guest name, gate, table,
// loyalty points, tax levy) stay empty, so the screens show nothing for them.

import '../domain/guest_receipt.dart';
import '../domain/receipt_category.dart';
import '../domain/receipt_line.dart';

/// Builds one receipt from a payment's JSON. [booking] is the payment's booking
/// record when it pays for one, otherwise null.
GuestReceipt receiptFromPayment(Map<String, dynamic> p, {Map<String, dynamic>? booking}) {
  // Step 1: the payment's own fields, with safe fallbacks for missing values.
  final id = p['id'] as String? ?? '';
  final label = p['label'] as String? ?? '';
  final module = p['module'] as String? ?? '';
  final providerRef = p['providerRef'] as String?;
  final at = DateTime.tryParse(p['settledAt'] as String? ?? '') ?? DateTime.tryParse(p['createdAt'] as String? ?? '') ?? DateTime.now();

  // Step 2: a booking adds its code, what was booked and its date.
  final offering = booking?['offeringName'] as String?;
  final code = booking?['code'] as String? ?? '';
  final total = (booking?['total'] as num?)?.toInt() ?? 0;
  final bookedOn = (booking?['date'] as String? ?? '').split('T').first;

  // Step 3: build the receipt.
  return GuestReceipt(
    id: id,
    ref: label,
    outlet: offering ?? p['outlet'] as String? ?? label,
    description: label,
    category: categoryForModule(module),
    amount: (p['amount'] as num?)?.toInt() ?? 0,
    method: methodLabel(p['method'] as String? ?? ''),
    place: '',
    at: at.toLocal(),
    points: 0,
    guestName: '',
    guestUnit: '',
    passNumber: code,
    gateCode: '',
    tableLabel: '',
    lines: booking == null ? const [] : [ReceiptLine(name: offering ?? label, detail: bookedOn, amount: total)],
    levy: 0,
    transactionId: providerRef ?? id,
  );
}

/// Which filter pill a payment belongs to, from the module that sold it.
ReceiptCategory categoryForModule(String module) => switch (module) {
  'room-bookings' => ReceiptCategory.stays,
  'museum' || 'crafts-bookshop' => ReceiptCategory.tours,
  'pool' || 'spa' => ReceiptCategory.wellness,
  _ => ReceiptCategory.dining,
};

/// The words a guest sees for a payment method code from the API.
String methodLabel(String code) => switch (code) {
  'mtn_momo' => 'MTN MoMo',
  'airtel_money' => 'Airtel Money',
  'card' => 'Card',
  'bank_transfer' => 'Bank transfer',
  'cash' => 'Cash',
  'room_charge' => 'Room charge',
  'corporate_account' => 'Corporate account',
  _ => code.replaceAll('_', ' '),
};
