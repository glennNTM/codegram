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
