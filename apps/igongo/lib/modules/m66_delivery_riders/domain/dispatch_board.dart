// The dispatcher's view (GET /api/delivery/board): jobs waiting for a rider,
// jobs on the way, the last 12 hours' finished ones, and who is online.

import '../../../shared/api/api_client.dart';
import 'delivery_job.dart';

/// A rider who is online now.
typedef OnlineRider = ({String userId, String name});

/// The dispatch board.
class DispatchBoard {
  /// Creates the board.
  const DispatchBoard({required this.waiting, required this.active, required this.done, required this.riders});

  /// Reads it from the API's JSON.
  factory DispatchBoard.fromJson(Json json) {
    List<DeliveryJob> jobs(String key) => [
      for (final j in json[key] as List<dynamic>? ?? const []) DeliveryJob.fromJson(j as Json),
    ];
    return DispatchBoard(
      waiting: jobs('waiting'),
      active: jobs('active'),
      done: jobs('done'),
      riders: [
        for (final r in json['riders'] as List<dynamic>? ?? const [])
          (userId: '${(r as Json)['userId']}', name: '${r['name']}'),
      ],
    );
  }

  /// Jobs no rider has yet.
  final List<DeliveryJob> waiting;

  /// Jobs a rider has.
  final List<DeliveryJob> active;

  /// Delivered or failed, last 12 hours.
  final List<DeliveryJob> done;

  /// Riders online now.
  final List<OnlineRider> riders;
}
