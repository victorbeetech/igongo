// The result of scanning a booking ticket: the server's verdict and, when the
// signature checks out, the booking itself. Pure Dart, no network code here.

import 'booking.dart';

/// The verdict words the server sends, shown to staff as they are.
const ticketVerdictWords = {
  'valid': 'Valid',
  'used': 'Used',
  'checked_in': 'Checked in',
  'forged': 'Forged',
  'cancelled': 'Cancelled',
  'unpaid': 'Not paid yet',
};

/// What staff should do next for each verdict, in plain words.
const ticketVerdictAdvice = {
  'valid': 'Valid. Let the guest in.',
  'used': 'Already used. This ticket was checked in before.',
  'checked_in': 'Checked in. Welcome.',
  'forged': 'Forged. The signature does not match. Do not let the guest in.',
  'cancelled': 'Cancelled. Do not let the guest in.',
  'unpaid': 'Not paid yet. Ask the guest to pay first.',
};

/// One scan: the [verdict] word from the server and the [booking], when there is one.
class TicketScan {
  /// Creates a scan result.
  const TicketScan({required this.verdict, this.booking});

  /// The server's verdict, for example `valid` or `forged`.
  final String verdict;

  /// The booking, present only when the signature matched.
  final Booking? booking;

  /// Whether the guest can be let in now.
  bool get isValid => verdict == 'valid';
}
