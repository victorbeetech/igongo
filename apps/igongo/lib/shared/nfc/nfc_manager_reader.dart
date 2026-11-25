// The phone's NFC reader, through the nfc_manager plugin. Android gives the
// UID on every tag; iPhone gives it for MIFARE/NTAG (the hotel's NTAG213
// cards) and ISO 7816 tags. Needs the NFC permission (Android) and the
// "NFC Tag Reading" capability (iPhone; see docs/NEEDS-YOU.md).

import 'dart:async';

import 'package:nfc_manager/nfc_manager.dart';
import 'package:nfc_manager/nfc_manager_android.dart';
import 'package:nfc_manager/nfc_manager_ios.dart';

import 'hex.dart';
import 'nfc_reader.dart';

/// `NfcReader` on the phone's NFC chip.
class NfcManagerReader implements NfcReader {
  Completer<String?>? _waiting;

  @override
  Future<bool> isAvailable() async {
    try {
      return await NfcManager.instance.checkAvailability() == NfcAvailability.enabled;
    } on Exception {
      return false;
    } on UnsupportedError {
      return false;
    }
  }

  @override
  Future<String?> readUid({String prompt = 'Hold the card near the phone'}) async {
    // Only one read at a time: a new read cancels the old one.
    await cancel();
    final waiting = _waiting = Completer<String?>();
    await NfcManager.instance.startSession(
      pollingOptions: {NfcPollingOption.iso14443, NfcPollingOption.iso15693},
      alertMessageIos: prompt,
      onDiscovered: (tag) async {
        // Step 1: the UID, from whichever form the platform gives.
        final bytes =
            NfcTagAndroid.from(tag)?.id ??
            MiFareIos.from(tag)?.identifier ??
            Iso7816Ios.from(tag)?.identifier ??
            Iso15693Ios.from(tag)?.identifier;
        // Step 2: one tag per read.
        await NfcManager.instance.stopSession(alertMessageIos: bytes == null ? null : 'Card read');
        if (!waiting.isCompleted) waiting.complete(bytes == null ? null : uidHex(bytes));
      },
      onSessionErrorIos: (_) {
        if (!waiting.isCompleted) waiting.complete(null);
      },
    );
    return waiting.future;
  }

  @override
  Future<void> cancel() async {
    final waiting = _waiting;
    if (waiting != null && !waiting.isCompleted) {
      waiting.complete(null);
      await NfcManager.instance.stopSession();
    }
  }
}
