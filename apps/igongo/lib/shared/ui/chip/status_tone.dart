// Which colour a status word gets. Status is never shown by colour alone:
// the chip always shows the word too.

/// The colour family of a status.
enum StatusTone {
  /// Done, paid, approved, on duty.
  success,

  /// Pending, late, low, waiting.
  warning,

  /// Failed, refused, blocked, overdue.
  error,

  /// New, scheduled, informational.
  info,

  /// Anything else.
  neutral;

  /// Picks a tone from a status word, such as "Blocked" or "Paid".
  static StatusTone of(String status) {
    final s = status.toLowerCase();
    // Each list is checked in order; the first match wins.
    if (RegExp(
      r'(fail|refus|block|lost|overdue|late|error|alarm|absent|out of order|damaged|missed|sold out|over limit|variance|void|expired|dirty|out$)',
    ).hasMatch(s)) {
      return StatusTone.error;
    }
    if (RegExp(
      r'(wait|pending|low|due|draft|review|probation|repair|busy|queued|degraded|partial|escalat|swap|gap|offline|on hold|needs|shortlist|expiring)',
    ).hasMatch(s)) {
      return StatusTone.warning;
    }
    if (RegExp(
      r'(done|paid|approved|active|healthy|online|passed|signed|published|connected|synced|verified|available|free|clean|delivered|claimed|complete|ready|open|in stock|on time|confirmed|inside|given|fixed|on site|answered|sent|inspected|in box)',
    ).hasMatch(s)) {
      return StatusTone.success;
    }
    if (RegExp(
      r'(new|scheduled|booked|in progress|preparing|cooking|assigned|on the way|picked|upcoming|today|enquiry|quoted|running|testing|interview)',
    ).hasMatch(s)) {
      return StatusTone.info;
    }
    return StatusTone.neutral;
  }
}
