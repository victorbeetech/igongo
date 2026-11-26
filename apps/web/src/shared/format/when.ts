// Dates and times as the hotel reads them (East Africa Time).

const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kampala", hour: "2-digit", minute: "2-digit" });
const DAY = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kampala", weekday: "short", day: "numeric", month: "short" });

/** "14:30" for an ISO time. */
export const timeOf = (iso: string) => TIME.format(new Date(iso));

/** "Thu 26 Nov, 14:30" for an ISO time. */
export const dayTimeOf = (iso: string) => `${DAY.format(new Date(iso))}, ${TIME.format(new Date(iso))}`;

/** Today in the hotel, `YYYY-MM-DD`. */
export const hotelToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kampala" }).format(new Date());

/** Words for a status key, such as "on_the_way" -> "On the way". */
export const words = (key: string) => (key.charAt(0).toUpperCase() + key.slice(1)).replace(/_/g, " ");
