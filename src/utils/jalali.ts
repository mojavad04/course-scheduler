import { toJalaali, isValidJalaaliDate, jalaaliMonthLength as jalaaliMonthLengthLib } from "jalaali-js";
import { toPersianDigits, toLatinDigits } from "./persianDigits";

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

/** Today's date converted to Jalali. */
export function todayJalali(): JalaliDate {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** Validates a Jalali year/month/day combination. */
export function isValidJalaliDate(jy: number, jm: number, jd: number): boolean {
  if (!Number.isInteger(jy) || !Number.isInteger(jm) || !Number.isInteger(jd)) return false;
  return isValidJalaaliDate(jy, jm, jd);
}

/** Number of days in a given Jalali month/year (handles leap years). */
export function jalaliMonthLength(jy: number, jm: number): number {
  return jalaaliMonthLengthLib(jy, jm);
}

/** Formats a Jalali date as "YYYY/MM/DD" using Persian digits, for display. */
export function formatJalaliPersian(dateStr: string): string {
  return toPersianDigits(dateStr);
}

/** Standardized internal storage format: "YYYY/MM/DD" with Latin digits. */
export function toStandardDateString(jy: number, jm: number, jd: number): string {
  const mm = String(jm).padStart(2, "0");
  const dd = String(jd).padStart(2, "0");
  return `${jy}/${mm}/${dd}`;
}

/** Parses a standardized "YYYY/MM/DD" string (Latin or Persian digits) into parts. */
export function parseStandardDateString(dateStr: string): JalaliDate | null {
  const normalized = toLatinDigits(dateStr.trim());
  const match = /^([0-9]{3,4})\/([0-9]{1,2})\/([0-9]{1,2})$/.exec(normalized);
  if (!match) return null;
  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  if (!isValidJalaliDate(jy, jm, jd)) return null;
  return { jy, jm, jd };
}

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
