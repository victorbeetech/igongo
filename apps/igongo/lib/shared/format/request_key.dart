// One random key per checkout or payment, sent with "place order" and sent
// again on a retry, so a double tap never orders or charges twice (the API
// returns the first result for a key it has already seen).

import 'dart:math';

/// A new random key of 32 hex characters, such as `9f1c…`.
String newRequestKey() {
  final random = Random.secure();
  return [for (var i = 0; i < 16; i++) random.nextInt(256).toRadixString(16).padLeft(2, '0')].join();
}
