// Points live data for the app (Riverpod): the API calls and the guest's wallet.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/api/api_client.dart';
import '../../../../shared/session/session_controller.dart';
import '../data/points_api.dart';
import '../domain/points_wallet.dart';

/// The points API on the app's client.
final pointsApiProvider = Provider((ref) => PointsApi(ref.watch(apiClientProvider)));

/// My points wallet. Reloads when the person signs in or out.
final pointsWalletProvider = FutureProvider.autoDispose<PointsWallet>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(pointsApiProvider).wallet();
});
