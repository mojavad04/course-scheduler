import { toPersianDigits } from "./persianDigits";

/** Parses "HH:MM" into total minutes since midnight. Returns null if invalid. */
export function parseTimeToMinutes(time: string): number | null {
  const match = /^([0-9]{1,2}):([0-9]{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function isValidTime(time: string): boolean {
  return parseTimeToMinutes(time) !== null;
}

/** Formats "HH:MM" (already valid) using Persian digits, zero-padded. */
export function formatTimePersian(time: string): string {
  const minutes = parseTimeToMinutes(time);
  if (minutes === null) return toPersianDigits(time);
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return toPersianDigits(`${h}:${m}`);
}

/** True when two [start,end) minute ranges overlap. */
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}
