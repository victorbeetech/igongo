// A guest's receipt, as the My receipts list and the Receipt Detail ticket
// show it. Plain data only: no widgets and no API types here.

import 'receipt_category.dart';
import 'receipt_line.dart';

/// One settled receipt (or folio) of the guest.
class GuestReceipt {
  /// Creates a receipt. Every field is required so no screen shows a gap.
  const GuestReceipt({
    required this.id,
    required this.ref,
    required this.outlet,
    required this.description,
    required this.category,
    required this.amount,
    required this.method,
    required this.place,
    required this.at,
    required this.points,
    required this.guestName,
    required this.guestUnit,
    required this.passNumber,
    required this.gateCode,
    required this.tableLabel,
    required this.lines,
    required this.levy,
    required this.transactionId,
  });

  /// Internal id, used to open the receipt.
  final String id;

  /// The printed reference, such as "RC-84920".
  final String ref;

  /// The outlet or service name, such as "Kaahwa Kanuzire Restaurant".
  final String outlet;

  /// One-line description under the outlet name.
  final String description;

  /// The filter category this receipt belongs to.
  final ReceiptCategory category;

  /// The amount paid in whole shillings.
  final int amount;

  /// The payment method, such as "MTN MoMo".
  final String method;

  /// Where it happened, such as "Table 14 (Veranda)".
  final String place;

  /// When the receipt was made.
  final DateTime at;

  /// Loyalty points earned on this receipt.
  final int points;

  /// The guest's name on the pass.
  final String guestName;

  /// The guest's unit, such as "Cottage 7 Veranda".
  final String guestUnit;

  /// The electronic pass number, such as "IGN-TK-89241".
  final String passNumber;

  /// The short service-gate code, such as "KHW".
  final String gateCode;

  /// The table or station label, such as "L-04".
  final String tableLabel;

  /// The manifest of bought items.
  final List<ReceiptLine> lines;

  /// The hospitality levy and VAT included in the total, in whole shillings.
  final int levy;

  /// The payment transaction id, such as "09848201".
  final String transactionId;
}
