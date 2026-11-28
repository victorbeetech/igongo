// Providers for the signed-in person's profile photo: the API calls, and the
// current photo (null when there is none).

import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../session/session_controller.dart';
import 'profile_photo_api.dart';

/// The profile photo calls, on the shared API client.
final profilePhotoApiProvider = Provider<ProfilePhotoApi>((ref) => ProfilePhotoApi(ref.watch(apiClientProvider)));

/// My current profile photo bytes, or null when I have none.
final currentProfilePhotoProvider = FutureProvider.autoDispose<Uint8List?>((ref) => ref.watch(profilePhotoApiProvider).current());
