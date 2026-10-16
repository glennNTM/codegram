/** 342 → "342", 12_400 → "12.4k", 1_250_000 → "1.2m" */
export function formatCount(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return `${trimDecimal(n / 1_000)}k`;
  return `${trimDecimal(n / 1_000_000)}m`;
}

function trimDecimal(value: number): string {
  return (value >= 100 ? Math.floor(value) : Math.floor(value * 10) / 10).toString();
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/** Compact age for headers: "now", "5m", "2h", "3d", "4w". */
export function formatAgeShort(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  if (diff < MINUTE) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d`;
  return `${Math.floor(diff / WEEK)}w`;
}

/** Long age for post footers: "just now", "2 hours ago", "3 days ago". */
export function formatAgeLong(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  const plural = (value: number, unit: string) => `${value} ${unit}${value === 1 ? "" : "s"} ago`;
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return plural(Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return plural(Math.floor(diff / HOUR), "hour");
  if (diff < WEEK) return plural(Math.floor(diff / DAY), "day");
  return plural(Math.floor(diff / WEEK), "week");
}

/** Video length: 42_000 → "0:42", 65_000 → "1:05". */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1_000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Bubble timestamp: "09:32". */
export function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Chat day separator: "Today", "Yesterday", "Monday", then "12 Oct". */
export function formatDayLabel(timestamp: number, now = Date.now()): string {
  const startOfDay = (t: number) => new Date(t).setHours(0, 0, 0, 0);
  const days = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  const d = new Date(timestamp);
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
