/**
 * The push messages a delivery sends as it moves (S66-10): to the rider
 * when a job is theirs, and to the guest when it leaves, arrives or fails.
 * Plain words; the link opens the tracker in the app.
 */

import type { UserMessage } from "@igongo/contracts/notifications";
import type { DeliveryJob } from "./delivery-job";

/** The tracker screen for [job] in the app. */
const trackLink = (job: DeliveryJob) => `/delivery/track/${job.id}`;

/** To the rider: a new job is theirs. */
export const assignedMessage = (job: DeliveryJob): UserMessage => ({ title: "New delivery", body: `${job.orderNumber} to ${job.place.label}`, channel: "work", link: "/delivery/rider" });

/** To the guest: it left with the rider. */
export const onTheWayMessage = (job: DeliveryJob): UserMessage => ({ title: "On the way", body: `${job.riderName ?? "Your rider"} is bringing ${job.orderNumber}. Your code is ${job.code}.`, channel: "bookings", link: trackLink(job) });

/** To the guest: handed over. */
export const deliveredMessage = (job: DeliveryJob): UserMessage => ({ title: "Delivered", body: `${job.orderNumber} was delivered. Enjoy!`, channel: "bookings", link: trackLink(job) });

/** To the guest: it could not be delivered. */
export const failedMessage = (job: DeliveryJob): UserMessage => ({ title: "Delivery problem", body: `${job.orderNumber} could not be delivered: ${job.failReason ?? "please call us"}.`, channel: "urgent", link: trackLink(job) });
