// Tests for the ticket scan result: only a valid verdict lets the guest in,
// and every verdict the server can send has words and advice for staff.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/ticket_scan.dart';

void main() {
  group('TicketScan', () {
    test('only a valid verdict allows check-in', () {
      expect(const TicketScan(verdict: 'valid').isValid, isTrue);
      for (final v in ['used', 'forged', 'cancelled', 'unpaid', 'checked_in']) {
        expect(TicketScan(verdict: v).isValid, isFalse, reason: v);
      }
    });

    test('every verdict has words and advice', () {
      expect(ticketVerdictWords.keys, ticketVerdictAdvice.keys);
      expect(ticketVerdictWords['forged'], 'Forged');
      expect(ticketVerdictAdvice['forged'], contains('Do not let the guest in'));
    });
  });
}
