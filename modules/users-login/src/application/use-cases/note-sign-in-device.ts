/**
 * Use case: after each sign-in, remember the device. The first time an
 * account that already had devices signs in on a new one, it is recorded
 * and the person (and for staff, every super admin) is told.
 */

import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import { sha256Hex } from "@igongo/core";
import type { KnownDeviceStore } from "../ports/known-device-store";
import type { SecurityAlerts } from "../ports/security-alerts";

export interface DeviceDeps {
  devices: KnownDeviceStore;
  alerts: SecurityAlerts;
  audit: AuditRecorder;
}

/** A short readable name for a browser or app, such as "Chrome on Windows". */
export function deviceLabel(userAgent: string | null | undefined): string {
  const ua = userAgent ?? "";
  const app = /Igongo|Dart/i.test(ua) ? "Igongo app" : /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "A browser";
  const os = /iPhone|iPad/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "an unknown device";
  return `${app} on ${os}`;
}

export async function noteSignInDevice(
  deps: DeviceDeps,
  person: { userId: string; email: string; name: string; isStaff: boolean },
  device: { userAgent: string | null | undefined; ip: string | null | undefined },
  alertsOn: boolean,
): Promise<void> {
  // 1. Remember it under a hash, so the raw browser text is not kept twice.
  const label = deviceLabel(device.userAgent);
  const key = await sha256Hex(device.userAgent ?? "unknown");
  const seen = await deps.devices.remember(person.userId, key, label);
  // 2. The very first device is not "new"; nothing to tell.
  if (!seen.isNew || seen.knownBefore === 0) return;
  await deps.audit.record({ actorId: person.userId, actorName: person.name, action: "login.new_device", module: "users-login", recordType: "user", recordId: person.userId, summary: `Signed in on a new device: ${label}`, context: device.ip ? { ip: device.ip } : {} });
  if (!alertsOn) return;
  // 3. Tell the person, and the super admins for staff accounts.
  await deps.alerts.toPerson(person, `New sign-in to your Igongo account: ${label}. If this was not you, sign out all devices and change your password.`);
  if (person.isStaff) await deps.alerts.toSuperAdmins(`${person.name} signed in on a new device: ${label}.`);
}
