/**
 * A notification rule the super admin builds in Notifications > Rule editor:
 * "when event X happens, tell these roles or people, by these channels".
 * The fields match the editor (Rule name, Event, Channels, Audience).
 */

import type { PushChannelId } from "@igongo/contracts/notifications";

/** The ways a rule can deliver a message. Only `push` is built so far. */
export type DeliveryChannel = "push" | "sms" | "whatsapp" | "email" | "inbox";

/** One notification rule. */
export interface NotificationRule {
  /** The rule's ID. */
  id: string;
  /** The name the super admin gave it. */
  name: string;
  /** The event that fires it, such as `fault.reported`. */
  event: string;
  /** Off rules are kept but never fire. */
  enabled: boolean;
  /** How to deliver it. */
  channels: DeliveryChannel[];
  /** Who gets it: roles, people, or both. */
  audience: { roles: string[]; userIds: string[] };
  /** The Android channel for the push, which sets how loud it is. */
  pushChannel: PushChannelId;
  /** The heading, with `{placeholders}` from the event's data. */
  titleTemplate: string;
  /** The text, with `{placeholders}` from the event's data. */
  bodyTemplate: string;
}

/** Fills `{name}` placeholders from [data]; unknown ones are left empty. */
export function fillTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => data[key] ?? "");
}
