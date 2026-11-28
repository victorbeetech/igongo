// The hotel's contact details shown on the Contact Us screen.
//
// These are PLACEHOLDERS taken from the Contact Us design. Victor has not confirmed
// them as final, so they are listed as an open question in docs/NEEDS-YOU.md.
// Change them here, in this one file, and the screen updates.
//
// The WhatsApp chat itself does not use [whatsappDisplay]: it opens the number the
// super admin sets on the server (see shared/contact/whatsapp_number.dart).

/// The hotel's contact numbers and addresses. Read-only constants, no logic.
abstract final class ContactDetails {
  /// The hotel name shown above the screen title.
  static const String hotelName = 'Igongo Country Hotel';

  /// The front desk number as people read it.
  static const String frontDeskDisplay = '+256 393 262 050';

  /// The front desk number in the form the phone dialler uses (no spaces).
  static const String frontDeskDial = '+256393262050';

  /// The number behind the call icon in the top bar of the design.
  static const String topBarDial = '+256392722963';

  /// The reservations email address.
  static const String reservationsEmail = 'reservations@igongo.co.ug';

  /// The WhatsApp concierge number as people read it (placeholder only, see above).
  static const String whatsappDisplay = '+256 772 123 456';

  /// The hotel and cultural grounds address shown in the location strip.
  static const String location = 'Mbarara - Masaka Highway, Biharwe, Mbarara, Uganda';
}
