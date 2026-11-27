// Riverpod providers for the guest's saved delivery pin. The checkout reads
// the pin once when it opens; saving a new pin refreshes it.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/api/api_client.dart';
import '../../../shared/session/session_controller.dart';
import '../data/saved_pin_api.dart';
import '../domain/delivery_pin.dart';

/// The saved-pin API, using the app's shared API client.
final savedPinApiProvider = Provider((ref) => SavedPinApi(ref.watch(apiClientProvider)));

/// The guest's saved delivery pin, or null when none is saved.
final savedPinProvider = FutureProvider.autoDispose<DeliveryPin?>((ref) => ref.watch(savedPinApiProvider).load());
