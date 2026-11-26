// Bonuses & Rewards live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/bonuses_api.dart';
import '../domain/my_rewards.dart';

/// The Bonuses API on the app's client.
final bonusesApiProvider = Provider((ref) => BonusesApi(ref.watch(apiClientProvider)));

/// My rewards.
final myRewardsProvider = FutureProvider.autoDispose<MyRewards>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(bonusesApiProvider).mine();
});
