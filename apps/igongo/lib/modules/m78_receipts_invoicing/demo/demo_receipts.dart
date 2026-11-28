// SAMPLE RECEIPTS for the My receipts and Receipt Detail screens. Every value
// here is placeholder data from the design, not the guest's real bills. The
// real list comes from the API when it is wired (see my_receipts_provider.dart).
// Delete this file with that wiring.

import '../domain/guest_receipt.dart';
import '../domain/receipt_category.dart';
import '../domain/receipt_line.dart';

/// Builds the sample receipts relative to [now], so "Today" and "Yesterday" stay right.
/// The list is newest first, as the screen shows it.
List<GuestReceipt> demoReceipts(DateTime now) {
  // Step 1: the two days the design groups by name.
  final today = DateTime(now.year, now.month, now.day);
  final yesterday = today.subtract(const Duration(days: 1));
  // Step 2: the older day the design shows as a full date.
  final earlier = DateTime(2026, 11, 24);

  return [
    GuestReceipt(
      id: 'RC-84920',
      ref: 'RC-84920',
      outlet: 'Kaahwa Kanuzire Restaurant',
      description: 'Flame-Grilled Tilapia & Passion Juice',
      category: ReceiptCategory.dining,
      amount: 34000,
      method: 'MTN MoMo',
      place: 'Table 14 (Veranda)',
      at: today.add(const Duration(hours: 13, minutes: 45)),
      points: 34,
      guestName: 'ENPHITIC',
      guestUnit: 'Cottage 7 Veranda',
      passNumber: 'IGN-TK-89241',
      gateCode: 'KHW',
      tableLabel: 'L-04',
      lines: const [
        ReceiptLine(
          name: 'Flame-Grilled Tilapia',
          detail: 'Steamed herb greens, matooke & lemon butter',
          amount: 28000,
        ),
        ReceiptLine(
          name: 'Chilled Passion Juice',
          detail: 'Freshly squeezed Ankole harvest blend (500ml)',
          amount: 6000,
        ),
      ],
      levy: 0,
      transactionId: '09848201',
    ),
    GuestReceipt(
      id: 'RC-84918',
      ref: 'RC-84918',
      outlet: 'Igongo Wellness Sanctuary',
      description: 'Ankole Herbal Rejuvenation Massage',
      category: ReceiptCategory.wellness,
      amount: 120000,
      method: 'Visa •• 4128',
      place: 'Pavilion 2',
      at: today.add(const Duration(hours: 11, minutes: 15)),
      points: 120,
      guestName: 'ENPHITIC',
      guestUnit: 'Cottage 7 Veranda',
      passNumber: 'IGN-TK-89240',
      gateCode: 'SPA',
      tableLabel: 'P-02',
      lines: const [
        ReceiptLine(name: 'Herbal Rejuvenation Massage', detail: '60 minutes, Ankole herbs', amount: 120000),
      ],
      levy: 0,
      transactionId: '09848177',
    ),
    GuestReceipt(
      id: 'RC-84882',
      ref: 'RC-84882',
      outlet: 'Erijukiro Cultural Museum',
      description: 'Ankole Longhorn Tour (2 Guests)',
      category: ReceiptCategory.tours,
      amount: 50000,
      method: 'Airtel Money',
      place: 'Main Foyer',
      at: yesterday.add(const Duration(hours: 15, minutes: 30)),
      points: 50,
      guestName: 'ENPHITIC',
      guestUnit: 'Cottage 7 Veranda',
      passNumber: 'IGN-TK-89215',
      gateCode: 'MUS',
      tableLabel: 'Tour',
      lines: const [ReceiptLine(name: 'Ankole Longhorn Tour', detail: 'Two guests', amount: 50000)],
      levy: 0,
      transactionId: '09847320',
    ),
    GuestReceipt(
      id: 'RC-84860',
      ref: 'RC-84860',
      outlet: 'Kaahwa Kanuzire Lawn',
      description: 'Nyama Choma & Matooke Dinner',
      category: ReceiptCategory.dining,
      amount: 48000,
      method: 'Cash at Desk',
      place: 'Garden Tables',
      at: yesterday.add(const Duration(hours: 20, minutes: 10)),
      points: 48,
      guestName: 'ENPHITIC',
      guestUnit: 'Cottage 7 Veranda',
      passNumber: 'IGN-TK-89210',
      gateCode: 'KHW',
      tableLabel: 'G-07',
      lines: const [ReceiptLine(name: 'Nyama Choma & Matooke', detail: 'Dinner for one', amount: 48000)],
      levy: 0,
      transactionId: '09846990',
    ),
    GuestReceipt(
      id: 'IGN-8924',
      ref: 'Folio: #IGN-8924',
      outlet: 'Hill View Cottages',
      description: 'Traditional Deluxe Thatched Cottage (Night 1)',
      category: ReceiptCategory.stays,
      amount: 260000,
      method: 'Folio settled',
      place: 'Cottage 04',
      at: earlier.add(const Duration(hours: 14)),
      points: 198,
      guestName: 'ENPHITIC',
      guestUnit: 'Cottage 04',
      passNumber: 'IGN-TK-89100',
      gateCode: 'HVC',
      tableLabel: 'Night 1',
      lines: const [ReceiptLine(name: 'Traditional Deluxe Thatched Cottage', detail: 'Night 1', amount: 260000)],
      levy: 0,
      transactionId: '09840011',
    ),
  ];
}
