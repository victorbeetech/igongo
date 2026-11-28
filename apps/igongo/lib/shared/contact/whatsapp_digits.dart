// Turns a typed phone number into the digits WhatsApp needs (country code, no symbols).

/// "0793 128 137" becomes 256793128137 (Uganda's country code replaces a leading 0). Other digits pass through.
String whatsappDigits(String typed) {
  // Step 1: keep digits only.
  final digits = typed.replaceAll(RegExp(r'[^0-9]'), '');
  // Step 2: a local number with a leading 0 gets the Uganda country code.
  return digits.startsWith('0') ? '256${digits.substring(1)}' : digits;
}
