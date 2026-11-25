// A pretend NFC reader for tests, the cloud and phones without NFC. It
// "reads" the UIDs it was given, in order, after a short wait.

import 'nfc_reader.dart';

/// `NfcReader` that returns preset UIDs.
class MockNfcReader implements NfcReader {
  /// Creates a reader that returns [uids] one per read (then null).
  MockNfcReader([List<String> uids = const ['04A1B2C3D4E5F6']]) : _uids = [...uids];

  final List<String> _uids;

  @override
  Future<bool> isAvailable() async => true;

  @override
  Future<String?> readUid({String prompt = ''}) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    return _uids.isEmpty ? null : _uids.removeAt(0);
  }

  @override
  Future<void> cancel() async {}
}
