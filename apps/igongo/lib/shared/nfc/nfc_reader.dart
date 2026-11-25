// Reading NFC cards and wristbands, behind one small interface, so screens
// never depend on the NFC plugin. The phone version is [NfcManagerReader];
// tests and phones without NFC use [MockNfcReader]. Real reading can only be
// tested on a phone (see docs/NEEDS-YOU.md).

/// Reads one tag's UID at a time.
abstract interface class NfcReader {
  /// True when this phone can read NFC now (it has NFC and it is switched on).
  Future<bool> isAvailable();

  /// Waits for one tap and returns the chip UID as upper-case hex, such as
  /// `04A1B2C3D4E5F6`, or null when the person cancels or times out.
  Future<String?> readUid({String prompt = 'Hold the card near the phone'});

  /// Stops waiting.
  Future<void> cancel();
}
