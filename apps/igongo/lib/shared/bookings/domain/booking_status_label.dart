// Turns a booking's status code from the API into the words the guest reads.
// Unknown codes are shown as they are, so a new status never shows blank.

/// The words for each status code the API returns.
const _statusWords = <String, String>{
  'requested': 'Requested',
  'awaiting_payment': 'Awaiting payment',
  'confirmed': 'Confirmed',
  'checked_in': 'Checked in',
  'cancelled': 'Cancelled',
};

/// The guest-facing words for [status] (for example `confirmed` becomes `Confirmed`).
String bookingStatusLabel(String status) => _statusWords[status] ?? status;
