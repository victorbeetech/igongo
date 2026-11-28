// Speech to text for the search box's mic. It asks for the microphone and speech
// permission the first time, then turns what the guest says into text. The search
// screen puts the text in the search box and searches it, as if it were typed.
// The phone can stop listening on its own (a pause, a timeout or an error), so the
// caller is told when listening has ended, and the mic never stays stuck on.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speech_to_text/speech_to_text.dart';

/// Turns speech into text on the phone. One instance is shared by the app.
class VoiceSearch {
  /// The platform's speech recogniser.
  final SpeechToText _speech = SpeechToText();

  /// Called once when listening ends, however it ends. Null when nobody is listening.
  void Function()? _onEnded;

  /// Asks for permission and gets the recogniser ready. Returns false when the phone cannot listen (or the guest says no).
  Future<bool> initialize() async {
    // Step 1: initialise once; the plugin asks for the microphone and speech permission the first time.
    try {
      return await _speech.initialize(onStatus: _onStatus, onError: (_) => _finish());
    } on Object {
      return false;
    }
  }

  /// Starts listening. [onText] gets the words recognised so far; [onEnded] is called once when the phone stops listening for any reason.
  Future<void> listen(void Function(String text) onText, {required void Function() onEnded}) async {
    // Step 2: remember who to tell when listening stops; each result carries the words recognised so far.
    _onEnded = onEnded;
    await _speech.listen(onResult: (result) => onText(result.recognizedWords));
  }

  /// Stops listening and keeps the words recognised so far.
  Future<void> stop() async {
    await _speech.stop();
    _finish();
  }

  /// Reads the plugin's status words; "done" and "notListening" mean the phone has stopped listening.
  void _onStatus(String status) {
    if (status == SpeechToText.doneStatus || status == SpeechToText.notListeningStatus) _finish();
  }

  /// Tells the caller once that listening has ended, then forgets it so it is not called twice.
  void _finish() {
    final ended = _onEnded;
    _onEnded = null;
    ended?.call();
  }
}

/// The app's voice search (one instance, so the permission is asked once).
final voiceSearchProvider = Provider<VoiceSearch>((ref) => VoiceSearch());
