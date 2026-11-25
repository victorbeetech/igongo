// Which NFC reader the app uses. Phones (Android, iPhone) use the real chip;
// everything else, and builds made with `--dart-define=IGONGO_NFC=mock`,
// use the mock.

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'mock_nfc_reader.dart';
import 'nfc_manager_reader.dart';
import 'nfc_reader.dart';

/// True when the build asks for the mock reader.
const _forceMock = String.fromEnvironment('IGONGO_NFC') == 'mock';

/// The NFC reader for this device.
final nfcReaderProvider = Provider<NfcReader>((ref) {
  final phone =
      !kIsWeb && (defaultTargetPlatform == TargetPlatform.android || defaultTargetPlatform == TargetPlatform.iOS);
  return phone && !_forceMock ? NfcManagerReader() : MockNfcReader();
});
