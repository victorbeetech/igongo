// Chip UIDs as text: bytes to upper-case hex with no separators, the same
// form the API stores (normalizeUid in packages/core).

/// [bytes] as upper-case hex, such as `04A1B2C3`.
String uidHex(List<int> bytes) => bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join().toUpperCase();
