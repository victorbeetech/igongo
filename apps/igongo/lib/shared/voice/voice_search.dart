// Speech to text for the search box's mic. It asks for the microphone and speech
// permission the first time, then turns what the guest says into text. The search
// screen puts the text in the search box and searches it, as if it were typed.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speech_to_text/speech_to_text.dart';

/// Turns speech into text on the phone. One instance is shared by the app.
class VoiceSearch {
  /// The platform's speech recogniser.
  final SpeechToText _speech = SpeechToText();

  /// Asks for permission and gets the recogniser ready. Returns false when the phone cannot listen (or the guest says no).
  Future<bool> initialize() async {
    // Step 1: initialise once; the plugin asks for the microphone and speech permission the first time.
    try {
      return await _speech.initialize();
    } on Object {
      return false;
    }
  }

  /// Starts listening. [onText] gets the words so far, and `true` once the guest has finished speaking.
  Future<void> listen(void Function(String text, {required bool finished}) onText) async {
    // Step 2: each result carries the words recognised so far; the final one ends the listening.
    await _speech.listen(onResult: (result) => onText(result.recognizedWords, finished: result.finalResult));
  }

  /// Stops listening and keeps the words recognised so far.
  Future<void> stop() => _speech.stop();

  /// True while the recogniser is listening.
  bool get isListening => _speech.isListening;
}

/// The app's voice search (one instance, so the permission is asked once).
final voiceSearchProvider = Provider<VoiceSearch>((ref) => VoiceSearch());
