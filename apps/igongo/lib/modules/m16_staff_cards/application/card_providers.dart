// Staff Cards' live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/cards_api.dart';
import '../domain/my_card.dart';

/// The Staff Cards API on the app's client.
final cardsApiProvider = Provider((ref) => CardsApi(ref.watch(apiClientProvider)));

/// My card.
final myCardProvider = FutureProvider.autoDispose<MyCard>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(cardsApiProvider).mine();
});
