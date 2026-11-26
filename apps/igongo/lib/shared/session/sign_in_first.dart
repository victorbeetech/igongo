// Browsing needs no account, but booking, ordering and paying do. This asks a
// signed-out visitor to sign in (or create an account) before such a step.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../ui/toast/igongo_toast.dart';
import 'session_controller.dart';

/// True when someone is signed in; otherwise says why and opens the sign-in screen.
bool signedInOrAsk(BuildContext context, WidgetRef ref) {
  if (ref.read(sessionProvider).valueOrNull != null) return true;
  showIgongoToast(context, 'Sign in or create an account to book and order.');
  GoRouter.of(context).push('/sign-in');
  return false;
}
