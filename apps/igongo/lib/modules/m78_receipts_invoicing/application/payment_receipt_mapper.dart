// Turns one API payment into a GuestReceipt for the My receipts list and the
// Receipt Detail ticket. Only real payment fields are filled in. Fields the
// payments API does not hold (pass number, gate, table, manifest lines, loyalty
// points, guest name) stay empty, so the screens show nothing for them rather
// than sample values.

import '../domain/guest_receipt.dart';
import '../domain/receipt_category.dart';

/// Builds one receipt from a payment's JSON.
GuestReceipt receiptFromPayment(Map<String, dynamic> p) {
  // Step 1: the payment's own fields, with safe fallbacks for missing values.
  final id = p['id'] as String? ?? '';
  final label = p['label'] as String? ?? '';
  final outlet = p['outlet'] as String? ?? label;
  final module = p['module'] as String? ?? '';
  final amount = (p['amount'] as num?)?.toInt() ?? 0;
  final providerRef = p['providerRef'] as String?;
  final at = DateTime.tryParse(p['settledAt'] as String? ?? '') ?? DateTime.tryParse(p['createdAt'] as String? ?? '') ?? DateTime.now();

  // Step 2: build the receipt. Unknown fields are empty, never sample values.
  return GuestReceipt(
    id: id,
    ref: label,
    outlet: outlet,
    description: label,
    category: categoryForModule(module),
    amount: amount,
    method: methodLabel(p['method'] as String? ?? ''),
    place: '',
    at: at.toLocal(),
    points: 0,
    guestName: '',
    guestUnit: '',
    passNumber: '',
    gateCode: '',
    tableLabel: '',
    lines: const [],
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
